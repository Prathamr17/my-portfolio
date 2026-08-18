from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
from app import db
from app.models.admin import AdminUser

auth_bp = Blueprint("auth", __name__)


def _error(msg: str, code: int = 400):
    return jsonify({"success": False, "message": msg}), code


def _ok(data=None, msg: str = "OK", code: int = 200):
    resp = {"success": True, "message": msg}
    if data is not None:
        resp["data"] = data
    return jsonify(resp), code


# ── POST /api/auth/login ──────────────────────────────────────────────────────
@auth_bp.post("/login")
def login():
    body = request.get_json(silent=True) or {}
    email    = body.get("email", "").strip().lower()
    password = body.get("password", "")

    if not email or not password:
        return _error("Email and password are required.", 400)

    user: AdminUser = AdminUser.query.filter_by(email=email).first()
    if not user:
        return _error("Invalid credentials.", 401)

    # Lockout check
    if user.is_locked():
        return _error("Account locked due to too many failed attempts. Try again later.", 403)

    if not user.check_password(password):
        user.failed_attempts = (user.failed_attempts or 0) + 1
        if user.failed_attempts >= 5:
            from datetime import timedelta
            user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)
        db.session.commit()
        return _error("Invalid credentials.", 401)

    # Success — reset failed attempts
    user.failed_attempts = 0
    user.locked_until    = None
    user.last_login      = datetime.now(timezone.utc)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return _ok({"access_token": token, "user": user.to_dict()}, "Login successful.")


# ── GET /api/auth/me ──────────────────────────────────────────────────────────
@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = db.session.get(AdminUser, int(user_id))
    if not user:
        return _error("User not found.", 404)
    return _ok(user.to_dict())


# ── POST /api/auth/logout ─────────────────────────────────────────────────────
@auth_bp.post("/logout")
@jwt_required()
def logout():
    # JWT is stateless; the client must discard the token.
    # For a blacklist, add flask-jwt-extended TokenBlocklist here.
    return _ok(msg="Logged out. Please discard your token on the client.")
