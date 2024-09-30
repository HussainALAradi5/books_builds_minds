
from sqlalchemy import Column, Integer, String, Boolean
from config import db  
class User(db.Model):  
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    user_name = Column(String, unique=True, nullable=False)
    user_image = Column(String, nullable=False)
    password_digest = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'user_name': self.user_name,
            'user_image': self.user_image,
            'email': self.email,
            'is_admin': self.is_admin,
            'is_active': self.is_active,
        }
