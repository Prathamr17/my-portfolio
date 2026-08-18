from datetime import datetime, timezone
from app import db

VALID_CATEGORIES = ("ai", "language", "internship", "training", "workshop", "other")


class Certificate(db.Model):
    __tablename__ = "certificates"

    id             = db.Column(db.Integer, primary_key=True)
    title          = db.Column(db.String(200), nullable=False)
    issuer         = db.Column(db.String(200), nullable=True)
    issue_date     = db.Column(db.Date, nullable=True)
    category       = db.Column(db.String(50), default="other")   # see VALID_CATEGORIES
    image_url      = db.Column(db.String(500), nullable=True)
    credential_url = db.Column(db.String(500), nullable=True)
    created_at     = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at     = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "issuer": self.issuer,
            "issue_date": self.issue_date.isoformat() if self.issue_date else None,
            "category": self.category,
            "image_url": self.image_url,
            "credential_url": self.credential_url,
        }
