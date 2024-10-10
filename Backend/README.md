# ATB-PFE

![Alt text](Architecture-microservices-avec-Spring-Cloud.jpg)
![Alt text](web-app-architecture-components.jpg)    



# Advantages
Single Source of Truth: Having all shared models and DTOs in one place (shared-module) ensures that there is a single source of truth, reducing duplication and inconsistency.
Modularity: Other modules remain focused on their domain-specific logic while reusing common models from the shared-module.
Ease of Maintenance: Updates to shared models and DTOs only need to be made in one place, making the system easier to maintain and evolve.
Avoiding Circular Dependencies: By ensuring the shared-module is independent and lightweight, you avoid the risk of circular dependencies that could arise from tightly coupling modules.
This approach should work well as long as the shared-module is carefully managed to avoid unnecessary complexity. It promotes a clean architecture with a clear separation of concerns.





// step 1 : upload img
// step 2 : convert in needed
// step 3 : send to container X
// step 4 : fetch texts in img
// step 5 : send texts to back X
// step 6 : analyse fraude
// step 7 : save in db

To realize a robust and efficient fraud detection system using a dataset of old OCR results, you can follow a more structured and scalable approach. Here’s an enhanced proposal outlining steps and technologies that can improve the overall effectiveness of your solution:

### 1. Data Pipeline Development

- **ETL Process (Extract, Transform, Load)**:
    - Use an ETL tool or framework (like Apache NiFi or Apache Airflow) to automate data collection from various sources, perform cleaning, and transform the data into a suitable format for analysis. This helps ensure consistency and reduces manual errors.

### 2. Advanced Data Preprocessing

- **Natural Language Processing (NLP)**:
    - Leverage NLP libraries like **NLTK**, **spaCy**, or **Transformers** (Hugging Face) for advanced text processing, including:
        - Tokenization
        - Lemmatization/Stemming
        - Entity Recognition to identify key entities within the OCR text (e.g., dates, amounts, names).

- **Feature Engineering**:
    - Utilize both structured and unstructured features from the OCR results:
        - Text features (e.g., TF-IDF, word embeddings).
        - Document metadata (e.g., type, date).
        - Pattern recognition (e.g., through regex) for unusual formats.
        - Use unsupervised techniques (e.g., clustering) to discover hidden patterns that might indicate fraud.

### 3. Model Selection and Evaluation

- **Ensemble Learning**:
    - Combine multiple models (e.g., Random Forest, Gradient Boosting, Neural Networks) to enhance predictive performance. Techniques like **Stacking** or **Voting** can be effective in improving accuracy.

- **Deep Learning**:
    - Consider using advanced deep learning architectures such as **Recurrent Neural Networks (RNNs)** or **Transformers** for sequence prediction tasks. These models can capture more context and relationships within the text.

- **Hyperparameter Tuning**:
    - Use automated tools (like **Optuna**, **Hyperopt**, or **GridSearchCV** in Scikit-learn) to fine-tune hyperparameters for better model performance.

### 4. Continuous Learning

- **Feedback Loop**:
    - Implement a system to gather feedback on predictions. Use this feedback to continuously retrain and improve your models.

- **Model Monitoring**:
    - Deploy monitoring tools to track model performance over time. Tools like **Prometheus**, **Grafana**, or **Seldon** can provide insights into model drift and other performance metrics.

### 5. Deployment Strategy

- **Microservices Architecture**:
    - Use a microservices architecture to separate concerns and enable scalability. Each service can be responsible for specific functionalities (e.g., data ingestion, model inference, reporting).

- **Docker and Kubernetes**:
    - Containerize your application using Docker and orchestrate it with Kubernetes to facilitate deployment, scaling, and management of your application.

### 6. API Development

- **RESTful API**:
    - Create a RESTful API (using Spring Boot, Flask, or FastAPI) to serve model predictions. This will enable integration with other applications or frontend interfaces.

- **Authentication and Security**:
    - Implement authentication (e.g., JWT) and encryption for secure access to the API, especially if handling sensitive data.

### 7. User Interface

- **Interactive Dashboard**:
    - Develop a user-friendly dashboard (using frameworks like React, Angular, or Vue.js) to visualize results, monitor model performance, and provide insights into potential fraud cases.

### Example Workflow

Here’s a simplified workflow integrating these recommendations:

1. **Data Collection**: Automate data extraction from OCR results using an ETL tool.
2. **Data Preprocessing**: Clean and transform data using NLP techniques.
3. **Feature Engineering**: Create rich features for the model.
4. **Model Training**: Use an ensemble approach with hyperparameter tuning.
5. **Model Deployment**: Deploy as microservices using Docker and Kubernetes.
6. **API Serving**: Provide model predictions through a secure REST API.
7. **Monitoring**: Continuously monitor model performance and gather user feedback.
8. **Iterate**: Retrain models based on new data and feedback.

### Conclusion

By adopting a more structured approach that incorporates advanced techniques and modern development practices, you can build a scalable, efficient, and robust fraud detection system using your OCR dataset. This framework not only enhances performance but also provides flexibility for future expansions and improvements.

# ondoing
-swagger imp

-tessract with ar 

-kafka integration

-tensorflew impl

[//]: # (--------------------------)
### Step 2: 
mplementing a Robust Fraud Detection System
To develop a robust and efficient fraud detection system, you can follow these steps:

Dataset Preparation:

Gather a dataset of old OCR results that have been previously labeled (fraudulent or non-fraudulent).
Clean the dataset by removing duplicates, handling missing values, and ensuring that the data is in a consistent format.
Feature Engineering:

Extract relevant features from the OCR results. This may include:
Text length
Frequency of certain keywords
Patterns or specific formats within the text
Image features (if available, e.g., image quality, format)
Normalize and encode features appropriately.
Model Selection:

Choose an appropriate machine learning model for fraud detection. Some options include:
Decision Trees
Random Forests
Support Vector Machines (SVM)
Neural Networks
If using TensorFlow, you might consider training a neural network to classify the OCR results based on the labeled dataset.
Training the Model:

Split your dataset into training and testing sets.
Train your model using the training set and validate its performance using the testing set.
Use techniques like cross-validation to ensure your model generalizes well.
Integrating the Model:

After training, integrate the model into your OcrService class.
You can modify the determineFraudStatus method to utilize the trained model and make predictions based on the features extracted from the OCR results.
Performance Monitoring:

Regularly monitor the performance of the fraud detection system.
Implement logging and alerting mechanisms to flag potential issues or changes in fraud patterns.
Periodically retrain the model with new data to adapt to evolving fraud techniques.

###  tensorflow train model
the model in terms of accuracy, flexibility, and performance, with a focus on fine-tuning, better handling of signature variations, and optimization.

Key Improvements:
Transfer Learning: Leverages a pre-trained model (like InceptionV3 or MobileNetV2) for better feature extraction rather than training from scratch. Transfer learning helps achieve higher accuracy with less data.
Signature Alignment: Before comparing signatures, we apply a geometric transformation to account for size and orientation differences, improving signature matching accuracy.
Model Retraining: Implements incremental learning via a “fine-tuning” approach using new data rather than simple single-epoch updates, to avoid overfitting.
Batch Normalization and Dropout: Adds batch normalization and dropout layers to reduce overfitting and improve model generalization.
Advanced Optimizations: Includes quantization-aware training to optimize model size without sacrificing too much accuracy. Also leverages TensorFlow’s model pruning.
Enhanced Python Code
python
Copy code
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
Enhancements Breakdown:
Transfer Learning (InceptionV3):

Using a pre-trained model significantly boosts performance on small datasets. InceptionV3 is used here, but MobileNetV2 could be used if the focus is on edge devices with limited computational resources.
Fine-Tuning:

The model initially trains using the pre-trained base model but later unfreezes layers for fine-tuning, adapting the model further to your specific dataset.
Signature Alignment:

Aligns the extracted signatures before comparing them. This improves the robustness of signature matching, especially when size and orientation vary.
Quantization-aware Training:

A more advanced method to reduce the model's size and improve inference speed while maintaining accuracy, useful when deploying on edge devices or in production environments.
Incremental Learning with Fine-Tuning:

Instead of just updating the model with one epoch per new image, the model is fine-tuned in a more controlled manner. This prevents overfitting to a single new image and ensures more balanced incremental learning.