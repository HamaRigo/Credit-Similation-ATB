from flask import Flask
from app.config import Config
from app.routes.signature_routes import signature_bp
from app.models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Register blueprints
    app.register_blueprint(signature_bp)

    # Initialize the database
    db.init_app(app)

    return app
