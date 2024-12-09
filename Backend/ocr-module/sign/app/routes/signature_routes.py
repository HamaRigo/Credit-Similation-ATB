from flask import Blueprint, request, jsonify
from app.models import db
from app.utils.signature_utils import detect_signature, compare_signatures
from app.models.signature import Signature
import os
from werkzeug.utils import secure_filename

signature_bp = Blueprint('signature', __name__)

# Ensure uploads directory exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# Route for detecting and uploading a signature
@signature_bp.route('/upload-signature', methods=['POST'])
def upload_signature():
    try:
        # Check if the file is present in the request
        file = request.files.get('file')
        if not file:
            return jsonify({"error": "No file provided"}), 400

        # Save the file to the uploads directory
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Process the image to detect the signature text
        signature_text = detect_signature(file_path)

        if signature_text:
            # Create a new Signature entry in the database
            new_signature = Signature(signature_image=filename, signature_data=signature_text)
            db.session.add(new_signature)
            db.session.commit()
            return jsonify({"message": "Signature uploaded successfully", "signature_data": signature_text}), 201
        else:
            return jsonify({"error": "Signature detection failed"}), 400

    except Exception as e:
        print(f"Error uploading signature: {e}")
        return jsonify({"error": "Internal server error"}), 500


# Route for comparing signatures
@signature_bp.route('/compare-signatures', methods=['POST'])
def compare_signatures_route():
    try:
        # Check if the file is present in the request
        file = request.files.get('file')
        if not file:
            return jsonify({"error": "No file provided"}), 400

        # Save the uploaded file temporarily
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Process the uploaded file to detect signature data
        uploaded_signature = detect_signature(file_path)

        if not uploaded_signature:
            return jsonify({"error": "Failed to detect signature from uploaded file"}), 400

        # Fetch all stored signatures from the database
        saved_signatures = Signature.query.all()

        # Compare the uploaded signature with each stored signature
        for saved_signature in saved_signatures:
            # Assuming `compare_signatures` returns `True` if there's a match
            if compare_signatures(uploaded_signature, saved_signature.signature_data):
                return jsonify({"message": "Signature matched!", "matched_signature": saved_signature.signature_data}), 200

        return jsonify({"message": "No matching signature found"}), 404

    except Exception as e:
        print(f"Error comparing signatures: {e}")
        return jsonify({"error": "Internal server error"}), 500
