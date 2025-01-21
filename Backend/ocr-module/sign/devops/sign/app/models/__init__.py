from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models here
from app.models.signature import Signature
