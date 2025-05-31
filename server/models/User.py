from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from config import db

class User(db.Model):
    __tablename__ = "user"
    user_id = Column(Integer, primary_key=True)
    user_name = Column(String, unique=True, nullable=False)
    user_image = Column(String)
    password_digest = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    # purchased_books = relationship("Book", secondary="purchased_books", backref="users")
    purchased_books = relationship("Book", secondary="purchased_books", back_populates="purchased_by_users")
    receipts = relationship("Receipt", back_populates="user", cascade="all, delete-orphan")
    added_books = relationship("Book", back_populates="added_by_user")

    
    def to_dict(self):
        return {
                "user_id": self.user_id,
                "user_name": self.user_name,
                "user_image": self.user_image,
                "email": self.email,
                "is_admin": self.is_admin,
                "is_active": self.is_active,
                "purchased_books": [book.book_id for book in self.purchased_books],
                "receipts": [receipt.to_dict() for receipt in self.receipts],  
             }
    
    # def to_dict(self):
    #     return {
    #         "user_id": self.user_id,
    #         "user_name": self.user_name,
    #         "user_image": self.user_image,
    #         "email": self.email,
    #         "is_admin": self.is_admin,
    #         "is_active": self.is_active,
    #         "purchased_books": [book.book_id for book in self.purchased_books]
    #     }