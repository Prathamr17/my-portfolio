from datetime import datetime, timezone
from app import db


class ContactMessage(db.Model):
    __tablename__ = "contact_messages"

    id           = db.Column(db.Integer, primary_key=True)
    sender_name  = db.Column(db.String(200), nullable=False)
    sender_email = db.Column(db.String(200), nullable=False)
    subject      = db.Column(db.String(300), nullable=True)
    message      = db.Column(db.Text, nullable=False)
    is_read      = db.Column(db.Boolean, default=False)
    received_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "sender_name": self.sender_name,
            "sender_email": self.sender_email,
            "subject": self.subject,
            "message": self.message,
            "is_read": self.is_read,
            "received_at": self.received_at.isoformat() if self.received_at else None,
        }
