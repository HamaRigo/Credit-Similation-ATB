from flask import Blueprint, request, jsonify
from app.models import db
from app.utils.signature_utils import detect_signature, compare_signatures
from app.models.signature import Signature

signature_bp = Blueprint('signature', __name__)

# Route for detecting and uploading signature
@signature_bp.route('/upload-signature', methods=['POST'])
def upload_signature():
    file = request.files['file']
    if not file:
        return jsonify({"error": "No file provided"}), 400

    # Here you would process the image and store it as needed
    signature_image = detect_signature(file)
    if signature_image:
        new_signature = Signature(signature_image=signature_image.filename, signature_data=file.read())
        db.session.add(new_signature)
        db.session.commit()
        return jsonify({"message": "Signature uploaded successfully"}), 201
    else:
        return jsonify({"error": "Signature detection failed"}), 400

# Route for comparing signatures
@signature_bp.route('/compare-signatures', methods=['POST'])
def compare_signatures_route():
    file = request.files['file']
    if not file:
        return jsonify({"error": "No file provided"}), 400

    # Assuming that you compare the uploaded file against saved signatures in DB
    uploaded_signature = detect_signature(file)
    saved_signatures = Signature.query.all()

    for saved_signature in saved_signatures:
        is_match = compare_signatures(uploaded_signature, saved_signature)
        if is_match:
            return jsonify({"message": "Signature matched!"}), 200

    return jsonify({"message": "No matching signature found"}), 404
