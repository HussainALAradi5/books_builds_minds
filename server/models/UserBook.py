
from config import db

class UserBook(db.Model):
    __tablename__ = 'user_books'

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)

    book_id = db.Column(db.Integer, db.ForeignKey('books.isbn'), primary_key=True)

   
    purchase_date = db.Column(db.Date, nullable=False)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'book_id': self.book_id,
            'purchase_date': self.purchase_date
        }
