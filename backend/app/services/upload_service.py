import os
import uuid
from werkzeug.utils import secure_filename
from flask import Flask

try:
    import cloudinary
    import cloudinary.uploader
    CLOUDINARY_AVAILABLE = True
except ImportError:
    CLOUDINARY_AVAILABLE = False


def _allowed(filename: str, allowed: set) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed


def save_uploaded_file(file, app: Flask) -> str:
    """
    Validate and save an uploaded file.
    If Cloudinary credentials exist in environment, uploads to Cloudinary CDN and returns HTTPS URL.
    Otherwise falls back to local UPLOAD_FOLDER.
    """
    allowed = app.config.get("ALLOWED_EXTENSIONS", {"png", "jpg", "jpeg", "webp", "gif", "pdf"})

    if not _allowed(file.filename, allowed):
        raise ValueError(
            f"File type not allowed. Allowed types: {', '.join(sorted(allowed))}"
        )

    # 1. Try Cloudinary if credentials are configured
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")

    if CLOUDINARY_AVAILABLE and cloud_name and api_key and api_secret:
        try:
            cloudinary.config(
                cloud_name=cloud_name,
                api_key=api_key,
                api_secret=api_secret,
                secure=True
            )
            upload_result = cloudinary.uploader.upload(
                file,
                resource_type="auto",
                folder="portfolio_uploads"
            )
            secure_url = upload_result.get("secure_url")
            print(f"☁️ Successfully uploaded file to Cloudinary: {secure_url}")
            return secure_url
        except Exception as e:
            app.logger.warning(f"Cloudinary upload failed ({e}). Falling back to local storage.")

    # 2. Local fallback storage
    ext = file.filename.rsplit(".", 1)[1].lower()
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    safe_name   = secure_filename(unique_name)

    upload_folder = app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    save_path = os.path.join(upload_folder, safe_name)
    file.save(save_path)

    return f"/uploads/{safe_name}"
