import os
import numpy as np
import logging
import requests
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import InceptionV3
from tensorflow.keras.callbacks import ModelCheckpoint, TensorBoard
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from PIL import Image
from io import BytesIO
import base64

# Set up logging
logging.basicConfig(level=logging.INFO)

# Paths
MODEL_DIR = os.environ.get('MODEL_DIR', '/models/model/1/')
if not os.path.exists(MODEL_DIR):
os.makedirs(MODEL_DIR)

# Define Image Size and Other Parameters
IMG_HEIGHT = 299  # InceptionV3 requires 299x299 input
IMG_WIDTH = 299
BATCH_SIZE = int(os.environ.get('BATCH_SIZE', 32))
NUM_CLASSES = 2  # Binary classification: Healthy, Malformed
LEARNING_RATE = float(os.environ.get('LEARNING_RATE', 0.001))
EPOCHS = int(os.environ.get('EPOCHS', 10))

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

# Compile the model
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
loss='binary_crossentropy', metrics=['accuracy'])

# Data augmentation generator
data_gen = ImageDataGenerator(
rescale=1. / 255,
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
class_mode='binary'
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

# Main training loop
try:
    steps_per_epoch = train_generator.samples // BATCH_SIZE
validation_steps = val_generator.samples // BATCH_SIZE

model.fit(
train_generator,
epochs=EPOCHS,
steps_per_epoch=steps_per_epoch,
validation_data=val_generator,
validation_steps=validation_steps,
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
