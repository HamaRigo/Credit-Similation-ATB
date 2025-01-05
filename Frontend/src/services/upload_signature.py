from flask import Flask, request, jsonify
from your_database_module import save_signature_to_db  # A function to save signature to DB
import base64
    from io import BytesIO
    from PIL import Image

app = Flask(__name__)

@app.route('/api/upload-signature', methods=['POST'])
def upload_signature():
data = request.get_json()
signature_data = data.get('signature')

if not signature_data:
    return jsonify({"error": "No signature data provided"}), 400

# Decode the base64 image data
img_data = signature_data.split(",")[1]  # Remove 'data:image/png;base64,' part
img_bytes = base64.b64decode(img_data)

# Save the image to the database (or as a file, depending on your design)
img = Image.open(BytesIO(img_bytes))
save_signature_to_db(img)  # Save it to your DB

return jsonify({"message": "Signature uploaded successfully!"}), 200

if __name__ == '__main__':
app.run(debug=True)
