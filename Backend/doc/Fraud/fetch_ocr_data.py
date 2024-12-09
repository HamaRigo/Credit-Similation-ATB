import requests
import os
import json

# API URL for the Java service endpoint (update with the actual service URL)
API_URL = "http://java-service-host:8080/ocrs"

# Directory to store OCR images and texts
IMAGES_DIR = "./images"
OCR_TEXTS_DIR = "./ocr_texts"

# Ensure directories exist
os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(OCR_TEXTS_DIR, exist_ok=True)

def fetch_ocr_data(ocr_id=None):
    """
    Fetch OCR data from the Java service.

    :param ocr_id: OCR record ID to fetch specific data, or None to fetch all records.
    """
    try:
        if ocr_id:
            # Fetch specific OCR record by ID
            response = requests.get(f"{API_URL}/{ocr_id}")
        else:
            # Fetch all OCR records
            response = requests.get(API_URL)

        if response.status_code == 200:
            ocr_data = response.json()

            if isinstance(ocr_data, list):
                # Fetching all records
                for ocr in ocr_data:
                    save_ocr_data(ocr)
            else:
                # Fetching a specific OCR record
                save_ocr_data(ocr_data)
        else:
            print(f"Error fetching data: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error fetching OCR data: {e}")

def save_ocr_data(ocr_data):
    """
    Save OCR image and corresponding text to files.

    :param ocr_data: OCR data to save (dict containing image and text).
    """
    try:
        # Saving OCR image (if image URL or base64 string is available)
        image_url = ocr_data.get('imageUrl')  # Modify based on your API response
        if image_url:
            image_response = requests.get(image_url)
            if image_response.status_code == 200:
                image_filename = os.path.join(IMAGES_DIR, f"{ocr_data['id']}.png")
                with open(image_filename, 'wb') as img_file:
                    img_file.write(image_response.content)
                print(f"Saved image: {image_filename}")

        # Saving OCR text (if available)
        ocr_text = ocr_data.get('text', '')
        if ocr_text:
            text_filename = os.path.join(OCR_TEXTS_DIR, f"{ocr_data['id']}.txt")
            with open(text_filename, 'w') as text_file:
                text_file.write(ocr_text)
            print(f"Saved OCR text: {text_filename}")
    except Exception as e:
        print(f"Error saving OCR data: {e}")

# Fetch and save all OCR records
fetch_ocr_data()

# If you want to fetch a specific OCR record by ID:
# fetch_ocr_data(ocr_id="specific-id-here")
