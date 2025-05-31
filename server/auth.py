from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import jwt
from models.User import User
from models.Book import Book
from models.Receipt import Receipt 
from config import app, db

SECRET_KEY = app.config["JWT_SECRET_KEY"]

def generate_token(user_id):
    return jwt.encode({"user_id": user_id}, SECRET_KEY, algorithm="HS256")

def validate_token(token):
    if not token:
        return None
    try:
        decoded_token = jwt.decode(token.replace("Bearer ", ""), SECRET_KEY, algorithms=["HS256"])
        return decoded_token.get("user_id") if User.query.get(decoded_token.get("user_id")) else None
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def validate_password(password):
    return sum(c.isalpha() for c in password) >= 5 and sum(c.isdigit() for c in password) >= 3

def success_response(message, status_code=200):
    return jsonify({"message": message}), status_code

def error_response(message, status_code=400):
    return jsonify({"error": message}), status_code

def register_user():
    data = request.json
    user_name, email, password = data.get("user_name").lower(), data.get("email").lower(), data.get("password")
    if User.query.filter((User.user_name == user_name) | (User.email == email)).first():
        return error_response("Username or email already exists", 400)

    if not validate_password(password):
        return error_response("Password must contain at least 3 numbers and 5 letters", 400)
    new_user = User(user_name=user_name, email=email, password_digest=generate_password_hash(password), user_image=data.get("user_image"))
    db.session.add(new_user)
    db.session.commit()
    return success_response("User registered successfully", 201)

def login_user():
    data = request.json
    identifier, password = data.get("user_name_or_email").lower(), data.get("password")

    user = User.query.filter((User.user_name == identifier) | (User.email == identifier)).first()
    if not user or not check_password_hash(user.password_digest, password):
        return error_response("Invalid credentials", 401)
    return jsonify({"message": "Login successful", "token": generate_token(user.user_id)}), 200

def edit_user(user_id):
    token = request.headers.get("Authorization")
    user_id_from_token = validate_token(token)
    if not user_id_from_token:
        return error_response("Invalid or missing token", 401)
    if user_id != user_id_from_token:
        return error_response("Unauthorized: You can only edit your own profile", 403)
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found", 404)
    data = request.json
    if "user_name" in data:
        new_username = data["user_name"].lower()
        if User.query.filter(User.user_name == new_username, User.user_id != user_id).first():
            return error_response("Username already exists", 400)
        user.user_name = new_username
    if "email" in data:
        new_email = data["email"].lower()
        if User.query.filter(User.email == new_email, User.user_id != user_id).first():
            return error_response("Email already exists", 400)
        user.email = new_email
    if "user_image" in data:
        user.user_image = data["user_image"]
    if "is_admin" in data:
        user.is_admin = data["is_admin"] in ["true", "True", True]  # ✅ Convert properly
    if "password" in data:
        if not validate_password(data["password"]):
            return error_response("Password must contain at least 3 numbers and 5 letters", 400)
        user.password_digest = generate_password_hash(data["password"])
    db.session.commit()
    return jsonify({"message": "User profile updated successfully", "user": user.to_dict()}), 200

def add_book():
    token = request.headers.get("Authorization")
    user_id = validate_token(token)
    if not user_id:
        return error_response("Invalid or missing token", 401)
    user = User.query.get(user_id)
    if not user.is_admin:
        return error_response("Unauthorized: Only admins can add books", 403)
    data = request.json
    existing_book = Book.query.filter((Book.title == data.get("title")) | (Book.isbn == data.get("isbn"))).first()
    if existing_book:
        return error_response("A book with this title or ISBN already exists", 400)
    new_book = Book(
        isbn=data.get("isbn"),
        book_image=data.get("book_image"),
        title=data.get("title"),
        author=data.get("author"),
        publisher=data.get("publisher"),
        published_at=data.get("published_at"),
        price=data.get("price"),
        
        added_by_user_id=user_id,
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": "Book added successfully", "book": new_book.to_dict()}), 201

def get_books():
    return jsonify([book.to_dict() for book in Book.query.all()]), 200

def get_book(book_id):
    book = Book.query.get(book_id)
    return jsonify(book.to_dict() if book else {"error": "Book not found"}), 404 if not book else 200



def purchase_book(book_id):
    token = request.headers.get("Authorization")
    user_id = validate_token(token)
    if not user_id:
        return error_response("Invalid or missing token", 401)
    book = Book.query.get(book_id)
    if not book:
        return error_response("Book not found", 404)
    user = User.query.get(user_id)
    if user in book.purchased_by_users:
        return error_response("Book already purchased", 400)
    receipt = Receipt(user_id=user_id, book_id=book_id, written_time=datetime.utcnow())
    db.session.add(receipt)
    book.purchased_by_users.append(user)
    db.session.commit()
    return jsonify({"message": "Book purchased successfully", "book": book.to_dict(), "receipt": receipt.to_dict()}), 200

def get_purchased_books(user_id):
    token = request.headers.get("Authorization")
    user_id_from_token = validate_token(token)
    if not user_id_from_token:
        return error_response("Invalid or missing token", 401)
    if user_id != user_id_from_token:
        return error_response("Unauthorized: You can only view your own purchased books", 403)
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found", 404)
    purchased_books = [book.to_dict() for book in user.purchased_books]
    return jsonify({"message": "Purchased books retrieved successfully", "books": purchased_books}), 200