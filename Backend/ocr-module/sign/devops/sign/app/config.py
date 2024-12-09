import os

class Config:
    # Flask configurations
    SECRET_KEY = os.environ.get('SECRET_KEY', 'mysecretkey')

    # Database configurations (example with SQLite)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///signatures.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
