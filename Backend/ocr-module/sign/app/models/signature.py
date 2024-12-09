from app.models import db

class Signature(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    signature_image = db.Column(db.String(120), nullable=False)
    signature_data = db.Column(db.LargeBinary, nullable=False)

    def __repr__(self):
        return f'<Signature {self.id}>'
