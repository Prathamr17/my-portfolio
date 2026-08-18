from datetime import datetime, timezone
from app import db


class Internship(db.Model):
    __tablename__ = "internships"

    id               = db.Column(db.Integer, primary_key=True)
    company_name     = db.Column(db.String(200), nullable=False)
    role             = db.Column(db.String(200), nullable=False)
    start_date       = db.Column(db.Date, nullable=False)
    end_date         = db.Column(db.Date, nullable=True)
    is_current       = db.Column(db.Boolean, default=False)
    description      = db.Column(db.Text, nullable=True)
    tech_used        = db.Column(db.JSON, default=list)
    company_logo_url = db.Column(db.String(500), nullable=True)
    location         = db.Column(db.String(200), nullable=True)
    order_index      = db.Column(db.Integer, default=0)
    created_at       = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "company_name": self.company_name,
            "role": self.role,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "is_current": self.is_current,
            "description": self.description,
            "tech_used": self.tech_used or [],
            "company_logo_url": self.company_logo_url,
            "location": self.location,
            "order_index": self.order_index,
        }
