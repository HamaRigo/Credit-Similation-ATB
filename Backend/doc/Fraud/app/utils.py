import os
import torch
from torch.utils.data import Dataset
from PIL import Image
import numpy as np

class ChecksDataset(Dataset):
    def __init__(self, root, transform=None):
        self.root = root
        self.transform = transform
        # Assume images are stored directly in `root` directory
        self.image_files = [f for f in os.listdir(root) if f.endswith(('.png', '.jpg', '.jpeg'))]

    def __len__(self):
        return len(self.image_files)

    def __getitem__(self, idx):
        img_path = os.path.join(self.root, self.image_files[idx])
        image = Image.open(img_path)

        # Apply transformations if provided
        if self.transform:
            image = self.transform(image)
        else:
            # Default transformation (resize and convert to tensor)
            image = image.convert('RGB')
            image = image.resize((512, 512))  # Consistent size for input
            image = np.array(image)
            image = torch.tensor(image).permute(2, 0, 1).float() / 255.0  # Normalize to [0, 1]

        # Placeholder label for binary signature detection
        # Adjust the logic for label based on your file naming convention or data format
        label = 1 if 'signature' in img_path else 0  # Example: adjust according to your dataset

        return image, torch.tensor(label, dtype=torch.float32)


# Preprocessing function for image (same as in the training loop)
def preprocess_image(image):
    image = image.convert('RGB')
    image = image.resize((512, 512))
    image = np.array(image)
    return torch.tensor(image).permute(2, 0, 1).unsqueeze(0).float()

# Function to detect signature using the trained model
def detect_signature(image, detection_model, device):
    image_tensor = preprocess_image(image)
    with torch.no_grad():
        output = detection_model(image_tensor.to(device))
        output = output.squeeze(0).cpu().numpy()  # Removing batch dimension
    return output

# Function to compare two signatures
def compare_signatures(signature1, signature2, comparison_model):
    # For now, we assume signature2 is a stored signature, and we compute similarity
    similarity = cosine_similarity([signature1.flatten()], [signature2.flatten()])[0][0]
    return similarity, similarity > 0.85  # Threshold for matching
