from app import db


class Achievement(db.Model):
    __tablename__ = "achievements"

    id           = db.Column(db.Integer, primary_key=True)
    title        = db.Column(db.String(200), nullable=False)
    description  = db.Column(db.Text, nullable=True)
    icon         = db.Column(db.String(100), nullable=True)   # FontAwesome class
    metric_value = db.Column(db.String(50), nullable=True)    # "130+", "7", "3"
    metric_label = db.Column(db.String(100), nullable=True)   # "Problems Solved"
    order_index  = db.Column(db.Integer, default=0)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "icon": self.icon,
            "metric_value": self.metric_value,
            "metric_label": self.metric_label,
            "order_index": self.order_index,
        }
