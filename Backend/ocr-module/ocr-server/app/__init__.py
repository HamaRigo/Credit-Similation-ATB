from flask import Flask
from flask_restful import Api
from app.routes import OCRResource

def create_app():
    app = Flask(__name__)
    api = Api(app)

    # Add OCR endpoint
    api.add_resource(OCRResource, '/ocr')

    return app
