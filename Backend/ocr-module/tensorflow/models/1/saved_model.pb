import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import InceptionV3
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import cv2

# Paths
MODEL_DIR = '/models/1/'
SAVED_MODEL_PATH = f'{MODEL_DIR}/saved_model.pb'

# Define Image Size and Other Parameters
IMG_HEIGHT = 299  # InceptionV3 requires 299x299 input
IMG_WIDTH = 299
BATCH_SIZE = 32
NUM_CLASSES = 2  # Healthy, Malformed

# Data augmentation
datagen = ImageDataGenerator(
rescale=1./255,
rotation_range=30,
width_shift_range=0.2,
height_shift_range=0.2,
shear_range=0.2,
zoom_range=0.2,
horizontal_flip=True,
fill_mode='nearest',
validation_split=0.2
)

# Load and preprocess data
train_data = datagen.flow_from_directory(
'path_to_cheques_and_effets_images/',
target_size=(IMG_HEIGHT, IMG_WIDTH),
batch_size=BATCH_SIZE,
class_mode='binary',
subset='training'
)

val_data = datagen.flow_from_directory(
'path_to_cheques_and_effets_images/',
target_size=(IMG_HEIGHT, IMG_WIDTH),
batch_size=BATCH_SIZE,
class_mode='binary',
subset='validation'
)

# Transfer Learning: Use Pre-trained InceptionV3 model and fine-tune
base_model = InceptionV3(input_shape=(IMG_HEIGHT, IMG_WIDTH, 3), include_top=False, weights='imagenet')
base_model.trainable = False  # Freeze the base model to retain pre-learned features

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
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
epochs = 10
history = model.fit(
train_data,
validation_data=val_data,
epochs=epochs
)

# Fine-tune the base model by unfreezing some layers
base_model.trainable = True
fine_tune_at = 100  # Unfreeze layers from block 100 onwards
for layer in base_model.layers[:fine_tune_at]:
layer.trainable = False

# Recompile for fine-tuning
model.compile(optimizer=tf.keras.optimizers.Adam(1e-5),  # Lower learning rate for fine-tuning
loss='sparse_categorical_crossentropy',
metrics=['accuracy'])

# Fine-tuning
fine_tune_epochs = 5
history_fine = model.fit(
train_data,
validation_data=val_data,
epochs=fine_tune_epochs
)

# Save the model
model.save(MODEL_DIR)

# Signature Verification with Alignment
def align_signature(signature1, signature2):
"""
Align signatures using geometric transformations such as scaling, rotation, and translation.
"""
orb = cv2.ORB_create()
kp1, des1 = orb.detectAndCompute(signature1, None)
kp2, des2 = orb.detectAndCompute(signature2, None)

bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
matches = bf.match(des1, des2)
matches = sorted(matches, key=lambda x: x.distance)

# Calculate homography to align images based on matching keypoints
src_pts = np.float32([kp1[m.queryIdx].pt for m in matches]).reshape(-1, 1, 2)
dst_pts = np.float32([kp2[m.trainIdx].pt for m in matches]).reshape(-1, 1, 2)

matrix, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
aligned_signature = cv2.warpPerspective(signature1, matrix, (signature2.shape[1], signature2.shape[0]))

return aligned_signature

def verify_signature(image_path, reference_signature_path):
"""
Compares signatures by aligning them and then matching features.
"""
signature = extract_signature(image_path)
reference_signature = extract_signature(reference_signature_path)

aligned_signature = align_signature(signature, reference_signature)

similarity_score = compare_signatures(aligned_signature, reference_signature)

if similarity_score > 50:  # Threshold for match
print("Signature matches the reference.")
return True
else:
    print("Signature does not match the reference.")
return False

# Incremental Model Enhancement with Fine-Tuning
def enhance_model(new_image, label):
"""
Fine-tunes the model incrementally using a new image to improve performance.
"""
image = cv2.imread(new_image)
image_resized = cv2.resize(image, (IMG_WIDTH, IMG_HEIGHT))
image_resized = image_resized / 255.0
image_resized = np.expand_dims(image_resized, axis=0)

# Fine-tune with new data
model.fit(image_resized, np.array([label]), epochs=1)
model.save(MODEL_DIR)

# Quantization-aware Training for Model Optimization
def optimize_model():
"""
Quantization-aware training to optimize the model for faster inference without losing much accuracy.
"""
def apply_quantization_aware_training():
return tfmot.quantization.keras.quantize_model(model)

q_aware_model = apply_quantization_aware_training()

# Re-compile the model to apply the quantization steps
q_aware_model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Fine-tune with quantization aware model
q_aware_model.fit(train_data, validation_data=val_data, epochs=3)

# Convert to TensorFlow Lite model
converter = tf.lite.TFLiteConverter.from_saved_model(MODEL_DIR)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

with open(f"{MODEL_DIR}/optimized_model_quantized.tflite", "wb") as f:
    f.write(tflite_model)
print("Quantization-aware trained model saved as TFLite format.")

# Test signature verification
verify_signature('path_to_test_image', 'path_to_reference_signature')

# Optional: Optimize the model with quantization-aware training
optimize_model()
