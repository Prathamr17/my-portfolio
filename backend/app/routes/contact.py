from flask import Blueprint, request, jsonify
from app import db
from app.models.contact import ContactMessage
from app.services.email_service import send_contact_notification

contact_bp = Blueprint("contact", __name__)


def _ok(msg: str = "OK", data=None):
    r = {"success": True, "message": msg}
    if data:
        r["data"] = data
    return jsonify(r), 200


def _err(msg: str, code: int = 400):
    return jsonify({"success": False, "message": msg}), code


# ── POST /api/contact ─────────────────────────────────────────────────────────
@contact_bp.post("/contact")
def submit_contact():
    body = request.get_json(silent=True) or {}

    name    = body.get("name", "").strip()
    email   = body.get("email", "").strip().lower()
    subject = body.get("subject", "").strip()
    message = body.get("message", "").strip()

    # Basic validation
    errors = []
    if not name:
        errors.append("Name is required.")
    if not email or "@" not in email:
        errors.append("A valid email is required.")
    if not message or len(message) < 10:
        errors.append("Message must be at least 10 characters.")
    if errors:
        return _err(" ".join(errors), 400)

    # Save to DB
    msg = ContactMessage(
        sender_name=name,
        sender_email=email,
        subject=subject or "No subject",
        message=message,
    )
    db.session.add(msg)
    db.session.commit()

    # Fire notification email (non-blocking; errors logged but not exposed)
    try:
        send_contact_notification(msg)
    except Exception as exc:
        import traceback
        traceback.print_exc()
        # Don't fail the request if email fails
        print(f"[EMAIL ERROR] {exc}")

    return _ok("Your message has been sent! Pratham will get back to you soon.")
