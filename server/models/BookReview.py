from datetime import datetime
from config import db  

class BookReview(db.Model):
    __tablename__ = 'book_reviews'  

    review_id = db.Column(db.Integer, primary_key=True)  
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)  
    written_time = db.Column(db.DateTime, default=datetime.utcnow)  
    last_edit = db.Column(db.DateTime) 
    book_id = db.Column(db.Integer, db.ForeignKey('books.isbn'), nullable=False)  
    rating = db.Column(db.Integer, nullable=False)  

    def to_dict(self):
        return {
            'review_id': self.review_id,
            'user_id': self.user_id,
            'written_time': self.written_time.isoformat() if self.written_time else None,  
            'last_edit': self.last_edit.isoformat() if self.last_edit else None,  
            'book_id': self.book_id,
            'rating': self.rating  
        }
