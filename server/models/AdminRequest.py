from sqlalchemy import Column, Integer, Boolean, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from config import db

class AdminRequest(db.Model):
    __tablename__ = "admin_request"

    request_id = Column(Integer, primary_key=True, autoincrement=True)
    is_accepted = Column(Boolean, default=None) 
    review_time = Column(Date, nullable=True)  
    reviewed_by_user_id = Column(Integer, ForeignKey("user.user_id"), nullable=True)  
    reason_for_request = Column(Text, nullable=False)  
    requester_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)  
    requester = relationship("User", foreign_keys=[requester_id], backref="admin_requests")
    reviewed_by_user = relationship("User", foreign_keys=[reviewed_by_user_id], backref="reviewed_requests")

    def to_dict(self):
        return {
            "request_id": self.request_id,
            "is_accepted": self.is_accepted,
            "review_time": str(self.review_time) if self.review_time else None,
            "reviewed_by_user_id": self.reviewed_by_user_id,
            "reason_for_request": self.reason_for_request,
            "requester_id": self.requester_id,
        }