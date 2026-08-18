import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS

# ── Extension instances (no app bound yet) ────────────────────────────────────
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()


def create_app(config_name: str = "default") -> Flask:
    """Application factory."""
    app = Flask(__name__, static_folder="../uploads", static_url_path="/uploads")

    # ── Config ────────────────────────────────────────────────────────────────
    from app.config import config
    app.config.from_object(config[config_name])

    # Ensure upload folder exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # ── Extensions ────────────────────────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    
    # Enable CORS for Vercel and local development
    origins_cfg = app.config.get("FRONTEND_URL", "*")
    if not origins_cfg or origins_cfg == "*":
        CORS(app, resources={r"/api/*": {"origins": "*"}})
    else:
        allowed = [o.strip() for o in origins_cfg.split(",")]
        CORS(app, resources={r"/api/*": {"origins": allowed + ["http://localhost:5173", "http://localhost:3000"]}})

    # ── Import models so Migrate/Alembic can see them ─────────────────────────
    from app.models import (  # noqa: F401
        admin, about, skill, project, certificate,
        platform, internship, achievement, contact
    )

    # ── Register blueprints ───────────────────────────────────────────────────
    from app.routes.auth import auth_bp
    from app.routes.public import public_bp
    from app.routes.admin import admin_bp
    from app.routes.contact import contact_bp

    app.register_blueprint(auth_bp,    url_prefix="/api/auth")
    app.register_blueprint(public_bp,  url_prefix="/api/public")
    app.register_blueprint(admin_bp,   url_prefix="/api/admin")
    app.register_blueprint(contact_bp, url_prefix="/api")

    # ── Health check ──────────────────────────────────────────────────────────
    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "Portfolio API is running"}

    return app
