from flask import request, jsonify
from flask_restful import Resource
from app.utils import perform_ocr

class OCRResource(Resource):
    def post(self):
        if 'file' not in request.files:
            return {"error": "No file provided"}, 400

        file = request.files['file']
        if file.filename == '':
            return {"error": "No selected file"}, 400

        try:
            text = perform_ocr(file)
            return {"text": text}, 200
        except Exception as e:
            return {"error": str(e)}, 500
