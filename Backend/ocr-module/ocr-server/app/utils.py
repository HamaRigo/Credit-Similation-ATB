import pytesseract
from PIL import Image
import io

def perform_ocr(image_file):
    try:
        image = Image.open(image_file.stream)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        raise RuntimeError(f"OCR processing failed: {e}")
