from datetime import datetime
from config import db  

class AdminRequest(db.Model):
    __tablename__ = 'admin_requests' 

    request_id = db.Column(db.Integer, primary_key=True)
    is_accepted = db.Column(db.Boolean, default=False)  
    review_time = db.Column(db.DateTime)  
    reviewed_by_user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))  
    reviewed_by_user_name = db.Column(db.String) 
    reason_for_request = db.Column(db.String)  

    def to_dict(self):
        return {
            'request_id': self.request_id,
            'is_accepted': self.is_accepted,
            'review_time': self.review_time.isoformat() if self.review_time else None,  
            'reviewed_by_user_id': self.reviewed_by_user_id,
            'reviewed_by_user_name': self.reviewed_by_user_name,
            'reason_for_request': self.reason_for_request
        }
