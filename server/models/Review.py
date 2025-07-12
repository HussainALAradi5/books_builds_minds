from sqlalchemy import Column, Integer, Date, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from config import db


class Review(db.Model):
    __tablename__ = "review"

    review_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    book_id = Column(Integer, ForeignKey("book.book_id"), nullable=False)
    written_time = Column(Date, nullable=False)
    last_edit = Column(Date, nullable=True)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=False)
    user = relationship("User", backref="reviews")
    book = relationship("Book", back_populates="reviews")

    def to_dict(self):
        return {
            "review_id": self.review_id,
            "user_id": self.user_id,
            "user_name": self.user.user_name,
            "book_id": self.book_id,
            "comment": self.comment,
            "written_time": str(self.written_time),
            "last_edit": str(self.last_edit) if self.last_edit else None,
            "rating": self.rating,
        }
