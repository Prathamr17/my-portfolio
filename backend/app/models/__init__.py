# Import all models here so Flask-Migrate can detect them
from app.models.admin import AdminUser
from app.models.about import About
from app.models.skill import SkillCategory, Skill
from app.models.project import Project
from app.models.certificate import Certificate
from app.models.platform import Platform
from app.models.internship import Internship
from app.models.achievement import Achievement
from app.models.contact import ContactMessage

__all__ = [
    "AdminUser", "About",
    "SkillCategory", "Skill",
    "Project", "Certificate",
    "Platform", "Internship",
    "Achievement", "ContactMessage",
]
