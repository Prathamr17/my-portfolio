from datetime import datetime, timezone
from app import db


class Platform(db.Model):
    __tablename__ = "platforms"

    id              = db.Column(db.Integer, primary_key=True)
    name            = db.Column(db.String(100), nullable=False)
    description     = db.Column(db.Text, nullable=True)
    logo_url        = db.Column(db.String(500), nullable=True)
    profile_url     = db.Column(db.String(500), nullable=True)
    problems_solved = db.Column(db.String(50), nullable=True)    # "130+", "85"
    current_rating  = db.Column(db.String(50), nullable=True)    # "1540", "---"
    badges          = db.Column(db.JSON, default=list)           # [{"label":"..","img":".."}]
    stars           = db.Column(db.JSON, default=dict)           # {"Problem Solving": 2, "Java": 3}
    order_index     = db.Column(db.Integer, default=0)
    updated_at      = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "logo_url": self.logo_url,
            "profile_url": self.profile_url,
            "problems_solved": self.problems_solved,
            "current_rating": self.current_rating,
            "badges": self.badges or [],
            "stars": self.stars or {},
            "order_index": self.order_index,
        }
