from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.admin import AdminUser


def admin_required(fn):
    """
    Decorator that verifies a valid JWT AND checks the identity maps
    to a real AdminUser row. Use instead of bare @jwt_required() when
    you want the extra DB check.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = AdminUser.query.get(int(user_id))
        if not user:
            return jsonify({"success": False, "message": "Admin not found."}), 403
        return fn(*args, **kwargs)
    return wrapper
