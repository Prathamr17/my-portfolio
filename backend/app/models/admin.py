from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class AdminUser(db.Model):
    __tablename__ = "admin_users"

    id             = db.Column(db.Integer, primary_key=True)
    email          = db.Column(db.String(200), unique=True, nullable=False)
    password_hash  = db.Column(db.String(512), nullable=False)
    failed_attempts = db.Column(db.Integer, default=0)
    locked_until   = db.Column(db.DateTime, nullable=True)
    created_at     = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    last_login     = db.Column(db.DateTime, nullable=True)

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def is_locked(self) -> bool:
        if self.locked_until and self.locked_until > datetime.now(timezone.utc):
            return True
        return False

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "last_login": self.last_login.isoformat() if self.last_login else None,
        }
