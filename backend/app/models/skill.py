from app import db


class SkillCategory(db.Model):
    __tablename__ = "skill_categories"

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(100), nullable=False)
    icon        = db.Column(db.String(100), nullable=True)   # FontAwesome / devicon class
    order_index = db.Column(db.Integer, default=0)

    skills = db.relationship(
        "Skill", backref="category", cascade="all, delete-orphan",
        order_by="Skill.order_index"
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "icon": self.icon,
            "order_index": self.order_index,
            "skills": [s.to_dict() for s in self.skills],
        }


class Skill(db.Model):
    __tablename__ = "skills"

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(100), nullable=False)
    icon        = db.Column(db.String(200), nullable=True)   # devicon class or URL
    category_id = db.Column(
        db.Integer, db.ForeignKey("skill_categories.id", ondelete="CASCADE"),
        nullable=False
    )
    proficiency  = db.Column(db.Integer, default=70)         # 0-100 for charts
    order_index  = db.Column(db.Integer, default=0)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "icon": self.icon,
            "category_id": self.category_id,
            "proficiency": self.proficiency,
            "order_index": self.order_index,
        }
