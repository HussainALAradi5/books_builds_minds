from sqlalchemy import Column, Integer, String, Boolean, Numeric, Date, Text
from sqlalchemy.orm import relationship
from config import db
import json

class Book(db.Model):
    __tablename__ = 'books'
    
    isbn = db.Column(db.Integer, primary_key=True) 
    book_image = db.Column(db.String, nullable=False)
    title = db.Column(db.String, unique=True, nullable=False)  
    author = db.Column(db.String, nullable=False)  
    publisher = db.Column(db.String, nullable=False)
    published_at = db.Column(db.Date, nullable=False)  
    price = db.Column(db.Numeric(10, 2), default=0.00)
    purchased_by = db.Column(Text, nullable=True)  

    # Relationship to BookReview
    reviews = relationship("BookReview", back_populates="book", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'isbn': self.isbn,
            'book_image': self.book_image,
            'title': self.title,
            'author': self.author,
            'publisher': self.publisher,
            'published_at': self.published_at,  
            'price': self.price,
            'purchased_by': self.get_purchased_by(),
            'reviews': [review.to_dict() for review in self.reviews]  
        }

    def get_purchased_by(self):
        if self.purchased_by:
            return json.loads(self.purchased_by)  
        return []
