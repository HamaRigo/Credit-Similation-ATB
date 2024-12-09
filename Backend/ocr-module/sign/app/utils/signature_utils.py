import pytesseract
from PIL import Image

# Set Tesseract path if needed (on Windows or custom installs)
# pytesseract.pytesseract.tesseract_cmd = "/path/to/tesseract"

def detect_signature(file, lang='eng+fra+ara'):
    """
    Detects signature in an image using OCR with Tesseract.
    By default, the function uses 'eng+fra+ara' for English, French, and Arabic.

    :param file: The image file to process.
    :param lang: The language(s) to use for Tesseract OCR (e.g., 'eng', 'fra', 'ara').
    :return: The detected signature as text or None if detection fails.
    """
    try:
        img = Image.open(file)

        # Verify if the specified language is available for Tesseract
        available_languages = pytesseract.get_languages(config='')
        if not all(l in available_languages for l in lang.split('+')):
            raise ValueError(f"One or more languages ({lang}) are not supported by Tesseract.")

        # Use Tesseract to extract text from the image (signature text detection)
        signature_text = pytesseract.image_to_string(img, lang=lang)

        # Return signature text if detection was successful
        if signature_text.strip():
            return signature_text.strip()
        else:
            raise ValueError("No text detected in the image.")

    except Exception as e:
        print(f"Error detecting signature: {e}")
        return None


def compare_signatures(uploaded_signature, saved_signature):
    """
    Simulated signature comparison function.
    This should be replaced with an actual comparison method (e.g., deep learning, image comparison, etc.)

    :param uploaded_signature: The signature text or data from the uploaded image.
    :param saved_signature: The stored signature to compare with.
    :return: Boolean indicating whether the signatures match.
    """
    # Example: For now, let's simulate a comparison by simply checking if the texts are similar.
    # In reality, use advanced techniques for signature comparison.
    if uploaded_signature and saved_signature:
        return uploaded_signature.lower() == saved_signature.lower()
    return False  # Return False if signatures don't match or are empty
