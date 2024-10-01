from datetime import datetime
from config import db  

class Receipt(db.Model):
    __tablename__ = 'receipts'

    receipt_id = db.Column(db.Integer, primary_key=True)  
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False) 
    written_time = db.Column(db.DateTime, default=datetime.utcnow)  
    book_id = db.Column(db.Integer, db.ForeignKey('books.isbn'), nullable=False)  

    def to_dict(self):
        return {
            'receipt_id': self.receipt_id,
            'user_id': self.user_id,
            'written_time': self.written_time.isoformat() if self.written_time else None,  
            'book_id': self.book_id  
        }
