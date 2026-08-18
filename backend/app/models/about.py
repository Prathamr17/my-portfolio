from datetime import datetime, timezone
from app import db


class About(db.Model):
    __tablename__ = "about"

    id                = db.Column(db.Integer, primary_key=True)
    name              = db.Column(db.String(100), nullable=False, default="Pratham Raikar")
    tagline           = db.Column(db.String(200), default="AI-DS Engineer | Developer")
    bio               = db.Column(db.Text, nullable=False)
    profile_photo_url = db.Column(db.String(500), nullable=True)
    resume_url        = db.Column(db.String(500), nullable=True)
    github_url        = db.Column(db.String(500), nullable=True)
    linkedin_url      = db.Column(db.String(500), nullable=True)
    email             = db.Column(db.String(200), nullable=True)
    phone             = db.Column(db.String(50), nullable=True)
    college           = db.Column(db.String(300), nullable=True)
    degree            = db.Column(db.String(200), nullable=True)
    year              = db.Column(db.String(50), nullable=True)
    specialization    = db.Column(db.String(200), nullable=True)
    updated_at        = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "tagline": self.tagline,
            "bio": self.bio,
            "profile_photo_url": self.profile_photo_url,
            "resume_url": self.resume_url,
            "github_url": self.github_url,
            "linkedin_url": self.linkedin_url,
            "email": self.email,
            "phone": self.phone,
            "college": self.college,
            "degree": self.degree,
            "year": self.year,
            "specialization": self.specialization,
        }
