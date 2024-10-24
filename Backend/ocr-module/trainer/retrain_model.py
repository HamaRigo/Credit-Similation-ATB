import base64
import logging
import numpy as np
import os
import requests
import tensorflow as tf
from PIL import Image
from io import BytesIO
from tensorflow.keras import layers, models
from tensorflow.keras.applications import InceptionV3
from tensorflow.keras.callbacks import ModelCheckpoint, TensorBoard
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Set up logging
logging.basicConfig(level=logging.INFO)

# Paths
MODEL_DIR = os.environ.get('MODEL_DIR', '/models/model/1/')
SAVED_MODEL_PATH = os.path.join(MODEL_DIR, 'saved_model.pb')

# Define Image Size and Other Parameters
IMG_HEIGHT = 299  # InceptionV3 requires 299x299 input
IMG_WIDTH = 299
BATCH_SIZE = int(os.environ.get('BATCH_SIZE', 32))  # Use environment variable or default to 32
NUM_CLASSES = 2  # Binary classification: Healthy, Malformed
LEARNING_RATE = float(os.environ.get('LEARNING_RATE', 0.001))
EPOCHS = int(os.environ.get('EPOCHS', 10))  # Use environment variable or default to 10

# Transfer Learning: Use Pre-trained InceptionV3 model and fine-tune
base_model = InceptionV3(input_shape=(IMG_HEIGHT, IMG_WIDTH, 3), include_top=False, weights='imagenet')
base_model.trainable = True  # Unfreeze the base model for fine-tuning

# Fine-tune only the last few layers of InceptionV3
for layer in base_model.layers[:-100]:
    layer.trainable = False

# Add custom layers on top of InceptionV3
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.5),
    layers.Dense(NUM_CLASSES, activation='softmax')  # Binary classification
])

# Compile the model with Adam optimizer and learning rate
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
              loss='binary_crossentropy', metrics=['accuracy'])  # Use binary_crossentropy for binary classification

# Data augmentation generator
data_gen = ImageDataGenerator(
    rescale=1. / 255,  # Rescale pixel values to [0,1]
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

# Training and validation directories
TRAIN_DIR = '/trainer/data/training_data'
VAL_DIR = '/trainer/data/validation_data'

# Create the training and validation data generators
train_generator = data_gen.flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_HEIGHT, IMG_WIDTH),
    batch_size=BATCH_SIZE,
    class_mode='binary'  # Binary classification: healthy/malformed
)

val_generator = data_gen.flow_from_directory(
    VAL_DIR,
    target_size=(IMG_HEIGHT, IMG_WIDTH),
    batch_size=BATCH_SIZE,
    class_mode='binary'
)

# Callbacks for saving best model and monitoring with TensorBoard
checkpoint = ModelCheckpoint(filepath=os.path.join(MODEL_DIR, 'best_model.h5'),
                             save_best_only=True, monitor='val_loss', mode='min')
tensorboard_callback = TensorBoard(log_dir="/logs")


# Receive and preprocess image from OcrService
def receive_image_from_ocr_service():
    ocr_service_url = "http://ocr-module:8502/api/images"
    try:
        response = requests.get(ocr_service_url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        image_data_base64 = response.json().get('image')  # Assuming the image comes in Base64 format

        if image_data_base64:
            image = Image.open(BytesIO(base64.b64decode(image_data_base64)))
            # Convert image to a format usable by the model
            image = image.resize((IMG_WIDTH, IMG_HEIGHT))
            image = np.array(image) / 255.0  # Normalize to [0,1]
            image = np.expand_dims(image, axis=0)  # Add batch dimension
            return image
        else:
            logging.warning("No image data found in response.")
            return None
    except requests.exceptions.RequestException as e:
        logging.error(f"Error connecting to OCR service: {e}")
        return None


# Receive label from OCR service
def receive_label_from_ocr_service():
    ocr_service_url = "http://ocr-module:8502/api/labels"
    try:
        response = requests.get(ocr_service_url)
        response.raise_for_status()
        label = response.json().get('label')  # Fetch label dynamically
        if label in [0, 1]:  # Assuming binary classification (0: healthy, 1: malformed)
            return np.array([label])
        else:
            logging.warning(f"Invalid label received: {label}")
            return None
    except requests.exceptions.RequestException as e:
        logging.error(f"Error connecting to OCR service for label: {e}")
        return None


# Batch images and labels for training
def batch_images_from_ocr_service(batch_size):
    images, labels = [], []
    while len(images) < batch_size:
        image = receive_image_from_ocr_service()
        label = receive_label_from_ocr_service()
        if image is not None and label is not None:
            images.append(image[0])  # Append the image array
            labels.append(label[0])  # Append the label
        else:
            logging.warning("Failed to receive a complete image-label pair. Retrying...")
    return np.array(images), np.array(labels)


# Main training loop with dynamic image input and validation
try:
model.fit(
    train_generator,
    epochs=EPOCHS,
    steps_per_epoch=BATCH_SIZE,
    validation_data=val_generator,
    validation_steps=10,
    callbacks=[checkpoint, tensorboard_callback]
)
except Exception as e:
    logging.error(f"Error during training: {e}")


# Save the final model in a format compatible with TensorFlow Serving
def save_model(model):
    try:
        logging.info("Saving model in TensorFlow Serving format...")
        tf.saved_model.save(model, MODEL_DIR)  # Save in TensorFlow Serving format
        logging.info("Model saved successfully to %s", MODEL_DIR)
    except Exception as e:
        logging.error(f"Error saving model: {e}")


# Finally, save the model after training
save_model(model)
