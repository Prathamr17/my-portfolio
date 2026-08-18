import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from app import db
from app.models.about import About
from app.models.skill import SkillCategory, Skill
from app.models.project import Project
from app.models.certificate import Certificate
from app.models.platform import Platform
from app.models.internship import Internship
from app.models.achievement import Achievement
from app.models.contact import ContactMessage
from app.services.upload_service import save_uploaded_file

admin_bp = Blueprint("admin", __name__)


# ── Helpers ───────────────────────────────────────────────────────────────────
def _ok(data=None, msg: str = "OK", code: int = 200):
    r = {"success": True, "message": msg}
    if data is not None:
        r["data"] = data
    return jsonify(r), code


def _err(msg: str, code: int = 400):
    return jsonify({"success": False, "message": msg}), code


def _json():
    return request.get_json(silent=True) or {}


# ══════════════════════════════════════════════════════════════════════════════
# DASHBOARD
# ══════════════════════════════════════════════════════════════════════════════
@admin_bp.get("/dashboard")
@jwt_required()
def dashboard():
    unread = ContactMessage.query.filter_by(is_read=False).count()
    recent_msgs = (
        ContactMessage.query.order_by(ContactMessage.received_at.desc()).limit(5).all()
    )
    return _ok({
        "counts": {
            "projects":        Project.query.count(),
            "certificates":    Certificate.query.count(),
            "skills":          Skill.query.count(),
            "platforms":       Platform.query.count(),
            "internships":     Internship.query.count(),
            "achievements":    Achievement.query.count(),
            "unread_messages": unread,
        },
        "recent_messages": [m.to_dict() for m in recent_msgs],
    })


# ══════════════════════════════════════════════════════════════════════════════
# ABOUT ME
# ══════════════════════════════════════════════════════════════════════════════
@admin_bp.get("/about")
@jwt_required()
def admin_get_about():
    about = About.query.first()
    return _ok(about.to_dict() if about else {})


@admin_bp.put("/about")
@jwt_required()
def admin_update_about():
    body = _json()
    about = About.query.first()
    if not about:
        about = About()
        db.session.add(about)

    fields = [
        "name", "tagline", "bio", "profile_photo_url", "resume_url",
        "github_url", "linkedin_url", "email", "phone",
        "college", "degree", "year", "specialization",
    ]
    for f in fields:
        if f in body:
            setattr(about, f, body[f])
    db.session.commit()
    return _ok(about.to_dict(), "About updated.")


# ══════════════════════════════════════════════════════════════════════════════
# SKILLS
# ══════════════════════════════════════════════════════════════════════════════
@admin_bp.get("/skills")
@jwt_required()
def admin_get_skills():
    cats = SkillCategory.query.order_by(SkillCategory.order_index).all()
    return _ok([c.to_dict() for c in cats])


@admin_bp.post("/skill-categories")
@jwt_required()
def create_skill_category():
    body = _json()
    cat = SkillCategory(
        name=body.get("name", ""),
        icon=body.get("icon", ""),
        order_index=body.get("order_index", 0),
    )
    db.session.add(cat)
    db.session.commit()
    return _ok(cat.to_dict(), "Category created.", 201)


@admin_bp.put("/skill-categories/<int:cat_id>")
@jwt_required()
def update_skill_category(cat_id: int):
    cat = SkillCategory.query.get_or_404(cat_id)
    body = _json()
    for f in ["name", "icon", "order_index"]:
        if f in body:
            setattr(cat, f, body[f])
    db.session.commit()
    return _ok(cat.to_dict(), "Category updated.")


@admin_bp.delete("/skill-categories/<int:cat_id>")
@jwt_required()
def delete_skill_category(cat_id: int):
    cat = SkillCategory.query.get_or_404(cat_id)
    db.session.delete(cat)
    db.session.commit()
    return _ok(msg="Category deleted.")


@admin_bp.post("/skills")
@jwt_required()
def create_skill():
    body = _json()
    skill = Skill(
        name=body.get("name", ""),
        icon=body.get("icon", ""),
        category_id=body.get("category_id"),
        proficiency=body.get("proficiency", 70),
        order_index=body.get("order_index", 0),
    )
    db.session.add(skill)
    db.session.commit()
    return _ok(skill.to_dict(), "Skill created.", 201)


@admin_bp.put("/skills/<int:skill_id>")
@jwt_required()
def update_skill(skill_id: int):
    skill = Skill.query.get_or_404(skill_id)
    body = _json()
    for f in ["name", "icon", "category_id", "proficiency", "order_index"]:
        if f in body:
            setattr(skill, f, body[f])
    db.session.commit()
    return _ok(skill.to_dict(), "Skill updated.")


@admin_bp.delete("/skills/<int:skill_id>")
@jwt_required()
def delete_skill(skill_id: int):
    skill = Skill.query.get_or_404(skill_id)
    db.session.delete(skill)
    db.session.commit()
    return _ok(msg="Skill deleted.")


# ══════════════════════════════════════════════════════════════════════════════
# PROJECTS
# ══════════════════════════════════════════════════════════════════════════════
@admin_bp.get("/projects")
@jwt_required()
def admin_get_projects():
    projects = Project.query.order_by(Project.is_featured.desc(), Project.order_index).all()
    return _ok([p.to_dict() for p in projects])


@admin_bp.post("/projects")
@jwt_required()
def create_project():
    body = _json()
    project = Project(
        title=body.get("title", ""),
        description=body.get("description", ""),
        tech_tags=body.get("tech_tags", []),
        github_url=body.get("github_url"),
        live_url=body.get("live_url"),
        thumbnail_url=body.get("thumbnail_url"),
        is_featured=body.get("is_featured", False),
        order_index=body.get("order_index", 0),
    )
    db.session.add(project)
    db.session.commit()
    return _ok(project.to_dict(), "Project created.", 201)


@admin_bp.get("/projects/<int:project_id>")
@jwt_required()
def admin_get_project(project_id: int):
    return _ok(Project.query.get_or_404(project_id).to_dict())


@admin_bp.put("/projects/<int:project_id>")
@jwt_required()
def update_project(project_id: int):
    project = Project.query.get_or_404(project_id)
    body = _json()
    for f in ["title", "description", "tech_tags", "github_url", "live_url",
              "thumbnail_url", "is_featured", "order_index"]:
        if f in body:
            setattr(project, f, body[f])
    db.session.commit()
    return _ok(project.to_dict(), "Project updated.")


@admin_bp.delete("/projects/<int:project_id>")
@jwt_required()
def delete_project(project_id: int):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return _ok(msg="Project deleted.")


# ══════════════════════════════════════════════════════════════════════════════
# CERTIFICATES
# ══════════════════════════════════════════════════════════════════════════════
@admin_bp.get("/certificates")
@jwt_required()
def admin_get_certificates():
    certs = Certificate.query.order_by(Certificate.issue_date.desc()).all()
    return _ok([c.to_dict() for c in certs])


@admin_bp.post("/certificates")
@jwt_required()
def create_certificate():
    body = _json()
    from datetime import date
    issue_date = None
    if body.get("issue_date"):
        try:
            issue_date = date.fromisoformat(body["issue_date"])
        except ValueError:
            pass
    cert = Certificate(
        title=body.get("title", ""),
        issuer=body.get("issuer"),
        issue_date=issue_date,
        category=body.get("category", "other"),
        image_url=body.get("image_url"),
        credential_url=body.get("credential_url"),
    )
    db.session.add(cert)
    db.session.commit()
    return _ok(cert.to_dict(), "Certificate created.", 201)


@admin_bp.put("/certificates/<int:cert_id>")
@jwt_required()
def update_certificate(cert_id: int):
    cert = Certificate.query.get_or_404(cert_id)
    body = _json()
    from datetime import date
    for f in ["title", "issuer", "category", "image_url", "credential_url"]:
        if f in body:
            setattr(cert, f, body[f])
    if "issue_date" in body and body["issue_date"]:
        try:
            cert.issue_date = date.fromisoformat(body["issue_date"])
        except ValueError:
            pass
    db.session.commit()
    return _ok(cert.to_dict(), "Certificate updated.")


@admin_bp.delete("/certificates/<int:cert_id>")
@jwt_required()
def delete_certificate(cert_id: int):
    cert = Certificate.query.get_or_404(cert_id)
    db.session.delete(cert)
    db.session.commit()
    return _ok(msg="Certificate deleted.")


# ══════════════════════════════════════════════════════════════════════════════
# PLATFORMS
# ══════════════════════════════════════════════════════════════════════════════
@admin_bp.get("/platforms")
@jwt_required()
def admin_get_platforms():
    platforms = Platform.query.order_by(Platform.order_index).all()
    return _ok([p.to_dict() for p in platforms])


@admin_bp.post("/platforms")
@jwt_required()
def create_platform():
    body = _json()
    p = Platform(
        name=body.get("name", ""),
        description=body.get("description"),
        logo_url=body.get("logo_url"),
        profile_url=body.get("profile_url"),
        problems_solved=body.get("problems_solved"),
        current_rating=body.get("current_rating"),
        badges=body.get("badges", []),
        stars=body.get("stars", {}),
        order_index=body.get("order_index", 0),
    )
    db.session.add(p)
    db.session.commit()
    return _ok(p.to_dict(), "Platform created.", 201)


@admin_bp.put("/platforms/<int:platform_id>")
@jwt_required()
def update_platform(platform_id: int):
    p = Platform.query.get_or_404(platform_id)
    body = _json()
    for f in ["name", "description", "logo_url", "profile_url",
              "problems_solved", "current_rating", "badges", "stars", "order_index"]:
        if f in body:
            setattr(p, f, body[f])
    db.session.commit()
    return _ok(p.to_dict(), "Platform updated.")


@admin_bp.delete("/platforms/<int:platform_id>")
@jwt_required()
def delete_platform(platform_id: int):
    p = Platform.query.get_or_404(platform_id)
    db.session.delete(p)
    db.session.commit()
    return _ok(msg="Platform deleted.")


# ══════════════════════════════════════════════════════════════════════════════
# INTERNSHIPS
# ══════════════════════════════════════════════════════════════════════════════
@admin_bp.get("/internships")
@jwt_required()
def admin_get_internships():
    internships = Internship.query.order_by(
        Internship.is_current.desc(), Internship.start_date.desc()
    ).all()
    return _ok([i.to_dict() for i in internships])


@admin_bp.post("/internships")
@jwt_required()
def create_internship():
    body = _json()
    from datetime import date
    start_date = date.fromisoformat(body["start_date"]) if body.get("start_date") else None
    end_date   = date.fromisoformat(body["end_date"])   if body.get("end_date")   else None
    i = Internship(
        company_name=body.get("company_name", ""),
        role=body.get("role", ""),
        start_date=start_date,
        end_date=end_date,
        is_current=body.get("is_current", False),
        description=body.get("description"),
        tech_used=body.get("tech_used", []),
        company_logo_url=body.get("company_logo_url"),
        location=body.get("location"),
        order_index=body.get("order_index", 0),
    )
    db.session.add(i)
    db.session.commit()
    return _ok(i.to_dict(), "Internship created.", 201)


@admin_bp.put("/internships/<int:internship_id>")
@jwt_required()
def update_internship(internship_id: int):
    i = Internship.query.get_or_404(internship_id)
    body = _json()
    from datetime import date
    for f in ["company_name", "role", "is_current", "description",
              "tech_used", "company_logo_url", "location", "order_index"]:
        if f in body:
            setattr(i, f, body[f])
    if "start_date" in body and body["start_date"]:
        i.start_date = date.fromisoformat(body["start_date"])
    if "end_date" in body:
        i.end_date = date.fromisoformat(body["end_date"]) if body["end_date"] else None
    db.session.commit()
    return _ok(i.to_dict(), "Internship updated.")


@admin_bp.delete("/internships/<int:internship_id>")
@jwt_required()
def delete_internship(internship_id: int):
    i = Internship.query.get_or_404(internship_id)
    db.session.delete(i)
    db.session.commit()
    return _ok(msg="Internship deleted.")


# ══════════════════════════════════════════════════════════════════════════════
# ACHIEVEMENTS
# ══════════════════════════════════════════════════════════════════════════════
@admin_bp.get("/achievements")
@jwt_required()
def admin_get_achievements():
    achievements = Achievement.query.order_by(Achievement.order_index).all()
    return _ok([a.to_dict() for a in achievements])


@admin_bp.post("/achievements")
@jwt_required()
def create_achievement():
    body = _json()
    a = Achievement(
        title=body.get("title", ""),
        description=body.get("description"),
        icon=body.get("icon"),
        metric_value=body.get("metric_value"),
        metric_label=body.get("metric_label"),
        order_index=body.get("order_index", 0),
    )
    db.session.add(a)
    db.session.commit()
    return _ok(a.to_dict(), "Achievement created.", 201)


@admin_bp.put("/achievements/<int:achievement_id>")
@jwt_required()
def update_achievement(achievement_id: int):
    a = Achievement.query.get_or_404(achievement_id)
    body = _json()
    for f in ["title", "description", "icon", "metric_value", "metric_label", "order_index"]:
        if f in body:
            setattr(a, f, body[f])
    db.session.commit()
    return _ok(a.to_dict(), "Achievement updated.")


@admin_bp.delete("/achievements/<int:achievement_id>")
@jwt_required()
def delete_achievement(achievement_id: int):
    a = Achievement.query.get_or_404(achievement_id)
    db.session.delete(a)
    db.session.commit()
    return _ok(msg="Achievement deleted.")


# ══════════════════════════════════════════════════════════════════════════════
# CONTACT MESSAGES
# ══════════════════════════════════════════════════════════════════════════════
@admin_bp.get("/messages")
@jwt_required()
def get_messages():
    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    paginated = (
        ContactMessage.query
        .order_by(ContactMessage.received_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )
    return jsonify({
        "success": True,
        "data": [m.to_dict() for m in paginated.items],
        "total": paginated.total,
        "page": page,
        "per_page": per_page,
    }), 200


@admin_bp.put("/messages/<int:msg_id>/read")
@jwt_required()
def mark_message_read(msg_id: int):
    msg = ContactMessage.query.get_or_404(msg_id)
    msg.is_read = True
    db.session.commit()
    return _ok(msg.to_dict(), "Marked as read.")


@admin_bp.delete("/messages/<int:msg_id>")
@jwt_required()
def delete_message(msg_id: int):
    msg = ContactMessage.query.get_or_404(msg_id)
    db.session.delete(msg)
    db.session.commit()
    return _ok(msg="Message deleted.")


# ══════════════════════════════════════════════════════════════════════════════
# FILE UPLOAD
# ══════════════════════════════════════════════════════════════════════════════
@admin_bp.post("/upload")
@jwt_required()
def upload_file():
    if "file" not in request.files:
        return _err("No file part in request.", 400)
    file = request.files["file"]
    if file.filename == "":
        return _err("No file selected.", 400)
    try:
        url = save_uploaded_file(file, current_app)
        return _ok({"url": url}, "File uploaded.", 201)
    except ValueError as e:
        return _err(str(e), 400)
