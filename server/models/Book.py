from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from config import db

purchased_books_table = db.Table(
    "purchased_books",
    db.Column("user_id", Integer, ForeignKey("user.user_id")),
    db.Column("book_id", Integer, ForeignKey("book.book_id"))
)

class Book(db.Model):
    __tablename__ = "book"

    book_id = Column(Integer, primary_key=True, autoincrement=True)
    isbn = Column(String, unique=True, nullable=False)
    book_image = Column(String, nullable=True)
    title = Column(String, unique=True, nullable=False)
    author = Column(String, nullable=False)
    publisher = Column(String, nullable=False)
    published_at = Column(Date, nullable=False)
    price = Column(Float, nullable=False)
    added_by_user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)

    added_by_user = relationship("User", backref="added_books")
    purchased_by_users = relationship("User", secondary=purchased_books_table, backref="purchased_books_list")

    # ✅ Change direct reference to string: "Review"
    reviews = relationship("Review", back_populates="book", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "book_id": self.book_id,
            "isbn": self.isbn,
            "book_image": self.book_image,
            "title": self.title,
            "author": self.author,
            "publisher": self.publisher,
            "published_at": str(self.published_at),
            "price": self.price,
            "reviews": [review.to_dict() for review in self.reviews],  
            "added_by_user_id": self.added_by_user_id,
            "purchased_by": [user.user_id for user in self.purchased_by_users],
        }