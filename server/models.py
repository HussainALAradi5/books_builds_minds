from config import db
class User(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    user_name=db.Column(db.String,unique=True,nullable=False)
    password_digest=db.Column(db.String,nullable=False)
    email=db.Column(db.String,unique=True,nullable=False)
    is_admin=db.Column(db.Boolean,default=False)
    is_active=db.Column(db.Boolean,default=True)

class Book(db.Model):
    isbn = db.Column(db.Integer, primary_key=True) 
    title = db.Column(db.String, unique=True, nullable=False)  
    author = db.Column(db.String, nullable=False)  
    publisher = db.Column(db.String, nullable=False) 
    price = db.Column(db.Numeric(10, 2), default=0.00) 
    reviews = db.relationship('BookReview', backref='book', lazy=True)  

class BookReview(db.Model):
    id = db.Column(db.Integer, primary_key=True)  
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) 
    written_time = db.Column(db.DateTime, default=datetime.utcnow)
    last_edit = db.Column(db.DateTime) 
    book_id = db.Column(db.Integer, db.ForeignKey('book.isbn'), nullable=False)
     
class AdminRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    is_acceoted=db.Column(db.Boolean)
    review_time=db.Column(db.DataTime)
    reviewed_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    reviewed_by_user_name = db.Column(db.String)
    reason_for_request = db.Column(db.String)