from flask import Blueprint, jsonify, request
from app.models.about import About
from app.models.skill import SkillCategory, Skill
from app.models.project import Project
from app.models.certificate import Certificate
from app.models.platform import Platform
from app.models.internship import Internship
from app.models.achievement import Achievement

public_bp = Blueprint("public", __name__)


def _ok(data, code: int = 200):
    return jsonify({"success": True, "data": data}), code


def _err(msg: str, code: int = 404):
    return jsonify({"success": False, "message": msg}), code


# ── GET /api/health (For UptimeRobot Keep-Alive Ping) ─────────────────────────
@public_bp.get("/health")
def health_check():
    return _ok({"status": "ok", "message": "Backend is awake and active."})


# ── GET /api/public/all (Unified Single Request for Portfolio Data) ───────────
@public_bp.get("/all")
def get_all_public_data():
    about = About.query.first()
    categories = SkillCategory.query.order_by(SkillCategory.order_index).all()
    projects = Project.query.order_by(Project.is_featured.desc(), Project.order_index).all()
    certs = Certificate.query.order_by(Certificate.issue_date.desc()).all()
    platforms = Platform.query.order_by(Platform.order_index).all()
    internships = Internship.query.order_by(Internship.is_current.desc(), Internship.start_date.desc()).all()
    achievements = Achievement.query.order_by(Achievement.order_index).all()

    return _ok({
        "about": about.to_dict() if about else None,
        "skills": [c.to_dict() for c in categories],
        "projects": [p.to_dict() for p in projects],
        "certificates": [c.to_dict() for c in certs],
        "platforms": [p.to_dict() for p in platforms],
        "internships": [i.to_dict() for i in internships],
        "achievements": [a.to_dict() for a in achievements],
        "stats": {
            "projects": len(projects),
            "certificates": len(certs),
            "platforms": len(platforms),
            "internships": len(internships),
        }
    })


# ── GET /api/public/about ─────────────────────────────────────────────────────
@public_bp.get("/about")
def get_about():
    about = About.query.first()
    if not about:
        return _err("About data not found.", 404)
    return _ok(about.to_dict())


# ── GET /api/public/skills ────────────────────────────────────────────────────
@public_bp.get("/skills")
def get_skills():
    categories = (
        SkillCategory.query
        .order_by(SkillCategory.order_index)
        .all()
    )
    return _ok([c.to_dict() for c in categories])


# ── GET /api/public/projects ──────────────────────────────────────────────────
@public_bp.get("/projects")
def get_projects():
    tag = request.args.get("tag", "").strip()
    query = Project.query.order_by(
        Project.is_featured.desc(), Project.order_index
    )
    projects = query.all()
    if tag:
        projects = [p for p in projects if tag.lower() in [t.lower() for t in (p.tech_tags or [])]]
    return _ok([p.to_dict() for p in projects])


# ── GET /api/public/projects/<id> ─────────────────────────────────────────────
@public_bp.get("/projects/<int:project_id>")
def get_project(project_id: int):
    project = Project.query.get_or_404(project_id)
    return _ok(project.to_dict())


# ── GET /api/public/certificates ─────────────────────────────────────────────
@public_bp.get("/certificates")
def get_certificates():
    category = request.args.get("category", "").strip().lower()
    query = Certificate.query.order_by(Certificate.issue_date.desc())
    certs = query.all()
    if category and category != "all":
        certs = [c for c in certs if c.category == category]
    return _ok([c.to_dict() for c in certs])


# ── GET /api/public/platforms ─────────────────────────────────────────────────
@public_bp.get("/platforms")
def get_platforms():
    platforms = Platform.query.order_by(Platform.order_index).all()
    return _ok([p.to_dict() for p in platforms])


# ── GET /api/public/internships ───────────────────────────────────────────────
@public_bp.get("/internships")
def get_internships():
    internships = Internship.query.order_by(
        Internship.is_current.desc(), Internship.start_date.desc()
    ).all()
    return _ok([i.to_dict() for i in internships])


# ── GET /api/public/achievements ──────────────────────────────────────────────
@public_bp.get("/achievements")
def get_achievements():
    achievements = Achievement.query.order_by(Achievement.order_index).all()
    return _ok([a.to_dict() for a in achievements])


# ── GET /api/public/stats ─────────────────────────────────────────────────────
@public_bp.get("/stats")
def get_stats():
    """Aggregate counters for animated hero/about counters."""
    from app.models.project import Project
    from app.models.certificate import Certificate
    from app.models.platform import Platform
    from app.models.internship import Internship

    return _ok({
        "projects":     Project.query.count(),
        "certificates": Certificate.query.count(),
        "platforms":    Platform.query.count(),
        "internships":  Internship.query.count(),
    })
