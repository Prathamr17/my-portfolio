from datetime import datetime, timezone
from app import db


class Project(db.Model):
    __tablename__ = "projects"

    id            = db.Column(db.Integer, primary_key=True)
    title         = db.Column(db.String(200), nullable=False)
    description   = db.Column(db.Text, nullable=False)
    tech_tags     = db.Column(db.JSON, default=list)        # ["Python","Flask","MySQL"]
    github_url    = db.Column(db.String(500), nullable=True)
    live_url      = db.Column(db.String(500), nullable=True)
    thumbnail_url = db.Column(db.String(500), nullable=True)
    is_featured   = db.Column(db.Boolean, default=False)
    order_index   = db.Column(db.Integer, default=0)
    created_at    = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at    = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "tech_tags": self.tech_tags or [],
            "github_url": self.github_url,
            "live_url": self.live_url,
            "thumbnail_url": self.thumbnail_url,
            "is_featured": self.is_featured,
            "order_index": self.order_index,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
