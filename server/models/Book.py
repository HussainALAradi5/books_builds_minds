from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from config import db

# Association table for many-to-many relationship
purchased_books_table = db.Table(
    "purchased_books",
    db.Column("user_id", Integer, ForeignKey("user.user_id")),
    db.Column("book_id", Integer, ForeignKey("book.book_id")),
)


class Book(db.Model):
    __tablename__ = "book"

    book_id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String, unique=True)
    isbn = Column(String, unique=True, nullable=False)
    book_image = Column(String, nullable=True)
    title = Column(String, unique=True, nullable=False)
    author = Column(String, nullable=False)
    publisher = Column(String, nullable=False)
    published_at = Column(Date, nullable=False)
    price = Column(Float, nullable=False)
    added_by_user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    added_by_user = relationship("User", back_populates="added_books")
    purchased_by_users = relationship(
        "User", secondary=purchased_books_table, back_populates="purchased_books"
    )
    receipts = relationship("Receipt", backref="book", cascade="all, delete-orphan")
    reviews = relationship(
        "Review", back_populates="book", cascade="all, delete-orphan"
    )

    @property
    def average_rating(self):
        if not self.reviews:
            return 0.0
        avg = sum(review.rating for review in self.reviews) / len(self.reviews)
        return round(avg, 2)

    def to_dict(self):
        return {
            "book_id": self.book_id,
            "isbn": self.isbn,
            "book_image": self.book_image,
            "slug": self.slug,
            "title": self.title,
            "author": self.author,
            "publisher": self.publisher,
            "published_at": str(self.published_at),
            "price": self.price,
            "average_rating": self.average_rating,  # ✅ Added field
            "reviews": [review.to_dict() for review in self.reviews],
            "added_by_user_id": self.added_by_user_id,
            "purchased_by": [user.user_id for user in self.purchased_by_users],
        }
