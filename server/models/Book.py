# Book.py
from sqlalchemy import Column, Integer, String, Numeric, Date
from config import db
from UserBook import UserBook  

class Book(db.Model):
    __tablename__ = 'books'

    isbn = db.Column(db.Integer, primary_key=True)
    book_image = db.Column(db.String, nullable=False)
    title = db.Column(db.String, unique=True, nullable=False)
    author = db.Column(db.String, nullable=False)
    publisher = db.Column(db.String, nullable=False)
    published_at = db.Column(db.Date, nullable=False)
    price = db.Column(db.Numeric(10, 2), default=0.00)

    purchased_by = db.relationship('UserBook', backref='book', lazy=True)

    def to_dict(self):
        return {
            'isbn': self.isbn,
            'book_image': self.book_image,
            'title': self.title,
            'author': self.author,
            'publisher': self.publisher,
            'published_at': self.published_at,
            'price': self.price,
            'purchased_by': [owner.user.user_id for owner in self.purchased_by] 
        }
