from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
from models.User import User
from models.Book import Book
from config import db, app
import json

jwt = JWTManager(app)

def error_response(message, status_code):
    return jsonify({"message": message}), status_code

def validate_user_data(data):
    if 'user_or_email' not in data:
        return jsonify({'message': 'Missing field: user_or_email'}), 400
    if 'password' not in data:
        return jsonify({'message': 'Missing field: password'}), 400
    return None

def register():
    data = request.get_json()
    validation_error = validate_user_data(data)
    if validation_error:
        return validation_error

    user_name = data.get('user_name').lower()
    user_image = data.get('user_image')
    password = data.get('password')
    email = data.get('email').lower()

    if User.query.filter((User.user_name.ilike(user_name)) | (User.email.ilike(email))).first():
        return error_response('User already exists!', 409)

    password_digest = generate_password_hash(password)
    new_user = User(
        user_name=user_name,
        user_image=user_image,
        password_digest=password_digest,
        email=email
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'}), 201

def login():
    data = request.get_json()
    validation_error = validate_user_data(data)
    if validation_error:
        return validation_error

    user_or_email = data.get('user_or_email').lower()
    password = data.get('password')

    user = User.query.filter(
        (User.user_name.ilike(user_or_email)) | (User.email.ilike(user_or_email))
    ).first()

    if user and check_password_hash(user.password_digest, password):
        access_token = create_access_token(identity=user.user_id)
        return jsonify({'access_token': access_token}), 200

    return error_response('Invalid username or password.', 401)

def edit_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return error_response('User not found.', 404)

    if 'user_name' in data:
        user.user_name = data['user_name']
    if 'user_image' in data:
        user.user_image = data['user_image']
    if 'password' in data:
        user.password_digest = generate_password_hash(data['password'])
    if 'email' in data:
        user.email = data['email'].lower()

    db.session.commit()
    return jsonify({'message': 'User information updated successfully!'}), 200

def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return error_response('User not found.', 404)

    user.is_active = False
    db.session.commit()
    return jsonify({'message': 'User account has been deactivated.'}), 200

def user_details(user_id):
    user = User.query.get(user_id)
    if not user:
        return error_response('User not found.', 404)

    return jsonify(user.to_dict()), 200

def is_admin():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return user.is_admin if user else False

@jwt_required()
def purchase_book(isbn):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return error_response('User not found.', 404)

    book = Book.query.get(isbn)
    if not book:
        return error_response('Book not found.', 404)

    if user.user_id in book.get_purchased_by():
        return error_response('You already own this book.', 409)

    purchased_books = user.get_purchased_books()
    purchased_books.append(book.isbn)
    user.purchased_books = json.dumps(purchased_books)

    purchased_by = book.get_purchased_by()
    purchased_by.append(user.user_id)
    book.purchased_by = json.dumps(purchased_by)

    db.session.commit()
    return jsonify({'message': 'Book purchased successfully!'}), 200

@jwt_required()
def view_book_details(isbn):
    book = Book.query.get(isbn)
    if not book:
        return error_response('Book not found.', 404)

    return jsonify(book.to_dict()), 200

@jwt_required()
def add_book(data):
    if not is_admin():
        return error_response('Admin privileges required to add a book.', 403)

    new_book = Book(
        isbn=data['isbn'],
        book_image=data['book_image'],
        title=data['title'],
        author=data['author'],
        publisher=data['publisher'],
        published_at=data['published_at'],
        price=data['price'],
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify({'message': 'Book added successfully!'}), 201

@jwt_required()
def edit_book(isbn, data):
    if not is_admin():
        return error_response('Admin privileges required to edit a book.', 403)

    book = Book.query.get(isbn)
    if not book:
        return error_response('Book not found.', 404)

    book.book_image = data.get('book_image', book.book_image)
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.publisher = data.get('publisher', book.publisher)
    book.published_at = data.get('published_at', book.published_at)
    book.price = data.get('price', book.price)

    db.session.commit()
    return jsonify({'message': 'Book edited successfully!'}), 200

@jwt_required()
def remove_book(isbn):
    if not is_admin():
        return error_response('Admin privileges required to remove a book.', 403)

    book = Book.query.get(isbn)
    if not book:
        return error_response('Book not found.', 404)

    db.session.delete(book)
    db.session.commit()
    
    return jsonify({'message': 'Book removed successfully!'}), 200
