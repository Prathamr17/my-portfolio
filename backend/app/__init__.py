import os
from flask import Flask, request, make_response
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
    
    # Enable CORS globally across all routes
    CORS(app, resources={r"/*": {"origins": "*"}})

    @app.before_request
    def handle_options_preflight():
        if request.method == "OPTIONS":
            response = make_response()
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            return response

    @app.after_request
    def after_request(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

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
