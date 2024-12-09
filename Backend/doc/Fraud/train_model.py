import torch
import torch.optim as optim
from torch.utils.data import DataLoader
from doc.Fraud.app.models.detection_model import UNet
from doc.Fraud.app.utils import ChecksDataset
import torch.nn as nn

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load datasets
# train_data = ChecksDataset(root='/path_to_your_data/TrainSet')  # Update with your actual path
# valid_data = ChecksDataset(root='/path_to_your_data/TestSet')   # Update with your actual path
train_data = ChecksDataset(root='Fraud/data/TrainSet')
valid_data = ChecksDataset(root='Fraud/data/TestSet')


train_loader = DataLoader(train_data, batch_size=4, shuffle=True)
valid_loader = DataLoader(valid_data, batch_size=4, shuffle=False)

# Initialize U-Net model
model = UNet(in_channels=3, out_channels=1).to(device)

# Loss and optimizer
criterion = nn.BCEWithLogitsLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
epochs = 10
for epoch in range(epochs):
    model.train()
    running_loss = 0.0
    for inputs, labels in train_loader:
        inputs, labels = inputs.to(device).float(), labels.to(device).float()
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs.squeeze(1), labels.squeeze(1))
        loss.backward()
        optimizer.step()
        running_loss += loss.item()

    print(f"Epoch [{epoch+1}/{epochs}], Loss: {running_loss/len(train_loader)}")

# Save the trained model
torch.save(model.state_dict(), 'Fraud/app/models/detection_model/detection_model.pth')
