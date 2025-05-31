from sqlalchemy import Column, Integer, String, Text, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from config import db
import json

class Book(db.Model):
    __tablename__ = "book"

    book_id = Column(Integer, primary_key=True, autoincrement=True)
    isbn = Column(String, unique=True, nullable=False)
    book_image = Column(String, nullable=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    publisher = Column(String, nullable=False)
    published_at = Column(Date, nullable=False)
    price = Column(Float, nullable=False)
    reviews = Column(Text, nullable=True)
    added_by_user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    purchased_by = Column(Text, nullable=True)
    added_by_user = relationship("User", backref="added_books")

    def to_dict(self):
        return {
            "book_id": self.book_id,
            "isbn": self.isbn,
            "book_image": self.book_image,
            "title": self.title,
            "author": self.author,
            "publisher": self.publisher,
            "published_at": str(self.published_at),  # Convert date to string for JSON
            "price": self.price,
            "reviews": self.get_reviews(),
            "added_by_user_id": self.added_by_user_id,
            "purchased_by": self.get_purchased_by(),
        }

    def get_reviews(self):
        return json.loads(self.reviews) if self.reviews else []

    def get_purchased_by(self):
        return json.loads(self.purchased_by) if self.purchased_by else []