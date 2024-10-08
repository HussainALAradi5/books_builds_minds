from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    JWTManager,
    jwt_required,
    get_jwt_identity,
)
from models.User import User
from models.Book import Book
from models.BookReview import BookReview
from models.Receipt import Receipt
from models.AdminRequest import AdminRequest
from config import db, app
import json
from datetime import datetime
from image import upload_image, read_image, update_image

jwt = JWTManager(app)


def error_response(message, status_code):
    return jsonify({"message": message}), status_code


def validate_user_data(data, is_register=False):
    if is_register:
        required_fields = ["user_name", "email", "password"]
    else:
        required_fields = ["user_or_email", "password"]

    for field in required_fields:
        if field not in data:
            return error_response(f"Missing field: {field}", 400)
    return None


def get_user_or_error(user_id):
    user = User.query.get(user_id)
    if not user:
        raise ValueError("User not found.")
    return user


def is_admin_or_error(user):
    if not user.is_admin:
        raise ValueError("Admin privileges required.")


def register():

    user_name = request.form.get("user_name")
    password = request.form.get("password")
    email = request.form.get("email")

    if not user_name or not password or not email:
        return error_response("Missing required fields.", 400)

    user_name = user_name.lower()
    email = email.lower()

    if User.query.filter(
        (User.user_name.ilike(user_name)) | (User.email.ilike(email))
    ).first():
        return error_response("User already exists!", 409)

    password_digest = generate_password_hash(password)

    image_response = upload_image()
    if image_response[1] != 201:
        return image_response

    uploaded_filename = image_response[0]["filename"]

    new_user = User(
        user_name=user_name,
        user_image=uploaded_filename,
        password_digest=password_digest,
        email=email,
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully!"}), 201


def login():
    data = request.get_json()
    validation_error = validate_user_data(data)
    print(data)
    if validation_error:
        return validation_error

    user_or_email = data.get("user_or_email").lower()
    password = data.get("password")

    user = User.query.filter(
        (User.user_name.ilike(user_or_email)) | (User.email.ilike(user_or_email))
    ).first()

    if user and check_password_hash(user.password_digest, password):
        access_token = create_access_token(identity=user.user_id)
        return jsonify({"access_token": access_token}), 200

    return error_response("Invalid username or password.", 401)


@jwt_required()
def edit_user(user_id):
    data = request.get_json()
    user = get_user_or_error(user_id)

    if "user_name" in data:
        user.user_name = data["user_name"]

    if "user_image" in request.files:
        image_response = upload_image()
        if image_response[1] != 201:
            return image_response
        user.user_image = image_response[0]["filename"]

    if "password" in data:
        user.password_digest = generate_password_hash(data["password"])
    if "email" in data:
        user.email = data["email"].lower()

    db.session.commit()
    return jsonify({"message": "User information updated successfully!"}), 200


@jwt_required()
def delete_user(user_id):
    user = get_user_or_error(user_id)

    user.is_active = False
    db.session.commit()
    return jsonify({"message": "User account has been deactivated."}), 200


@jwt_required()
def user_details(user_id):
    user = get_user_or_error(user_id)
    return jsonify(user.to_dict()), 200


@jwt_required()
def purchase_book(isbn):
    user_id = get_jwt_identity()
    user = get_user_or_error(user_id)

    book = Book.query.get(isbn)
    if not book:
        return error_response("Book not found.", 404)

    if user.user_id in book.get_purchased_by():
        return error_response("You already own this book.", 409)

    create_receipt(user_id, isbn)

    # Update purchased_books and purchased_by
    update_purchased_lists(user, book)

    db.session.commit()
    return jsonify({"message": "Book purchased successfully!"}), 200


def update_purchased_lists(user, book):
    purchased_books = json.loads(user.purchased_books)
    purchased_books.append(book.isbn)
    user.purchased_books = json.dumps(purchased_books)

    purchased_by = book.get_purchased_by()
    purchased_by.append(user.user_id)
    book.purchased_by = json.dumps(purchased_by)


@jwt_required()
def add_book():
    user_id = get_jwt_identity()
    user = get_user_or_error(user_id)
    is_admin_or_error(user)

    data = request.get_json()
    new_book = Book(
        isbn=data["isbn"],
        book_image=data["book_image"],
        title=data["title"],
        author=data["author"],
        publisher=data["publisher"],
        published_at=data["published_at"],
        price=data["price"],
    )

    db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": "Book added successfully!"}), 201


@jwt_required()
def edit_book(isbn):
    user_id = get_jwt_identity()
    user = get_user_or_error(user_id)
    is_admin_or_error(user)

    data = request.get_json()
    book = Book.query.get(isbn)

    if not book:
        return error_response("Book not found.", 404)

    book.book_image = data.get("book_image", book.book_image)
    book.title = data.get("title", book.title)
    book.author = data.get("author", book.author)
    book.publisher = data.get("publisher", book.publisher)
    book.published_at = data.get("published_at", book.published_at)
    book.price = data.get("price", book.price)

    db.session.commit()
    return jsonify({"message": "Book edited successfully!"}), 200


@jwt_required()
def remove_book(isbn):
    user_id = get_jwt_identity()
    user = get_user_or_error(user_id)
    is_admin_or_error(user)

    book = Book.query.get(isbn)
    if not book:
        return error_response("Book not found.", 404)

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book removed successfully!"}), 200


@jwt_required()
def view_book_details(isbn):
    book = Book.query.get(isbn)
    if not book:
        return error_response("Book not found.", 404)

    return jsonify(book.to_dict()), 200


@jwt_required()
def manage_book(data, action, isbn=None):
    user_id = get_jwt_identity()
    user = get_user_or_error(user_id)
    is_admin_or_error(user)

    if action == "add":
        new_book = Book(
            isbn=data["isbn"],
            book_image=data["book_image"],
            title=data["title"],
            author=data["author"],
            publisher=data["publisher"],
            published_at=data["published_at"],
            price=data["price"],
        )
        db.session.add(new_book)
        message = "Book added successfully!"
    elif action == "edit":
        book = Book.query.get(isbn)
        if not book:
            return error_response("Book not found.", 404)
        book.book_image = data.get("book_image", book.book_image)
        book.title = data.get("title", book.title)
        book.author = data.get("author", book.author)
        book.publisher = data.get("publisher", book.publisher)
        book.published_at = data.get("published_at", book.published_at)
        book.price = data.get("price", book.price)
        message = "Book edited successfully!"
    elif action == "remove":
        book = Book.query.get(isbn)
        if not book:
            return error_response("Book not found.", 404)
        db.session.delete(book)
        message = "Book removed successfully!"
    else:
        return error_response("Invalid action.", 400)

    db.session.commit()
    return jsonify({"message": message}), 200


@jwt_required()
def add_review(isbn):
    user_id = get_jwt_identity()
    user = get_user_or_error(user_id)

    purchased_books = json.loads(user.purchased_books)
    if isbn not in purchased_books:
        return error_response("You must purchase this book to review it.", 403)

    data = request.get_json()
    if "review_text" not in data:
        return error_response("Missing review content.", 400)

    new_review = BookReview(
        user_id=user_id,
        book_id=isbn,
        review_text=data["review_text"],
        written_time=datetime.utcnow(),
        last_edit=datetime.utcnow(),
    )

    db.session.add(new_review)
    db.session.commit()
    return jsonify({"message": "Review added successfully!"}), 201


@jwt_required()
def edit_review(isbn, review_id):
    user_id = get_jwt_identity()
    review = BookReview.query.get(review_id)

    if not review or review.book_id != isbn:
        return error_response("Review not found.", 404)

    if review.user_id != user_id:
        return error_response("You can only edit your own reviews.", 403)

    data = request.get_json()
    if "review_text" in data:
        review.review_text = data["review_text"]

    review.last_edit = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Review updated successfully!"}), 200


@jwt_required()
def remove_review(isbn, review_id):
    user_id = get_jwt_identity()
    review = BookReview.query.get(review_id)

    if not review or review.book_id != isbn:
        return error_response("Review not found.", 404)

    if review.user_id != user_id:
        return error_response("You can only delete your own reviews.", 403)

    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "Review removed successfully!"}), 200


@jwt_required()
def view_review(isbn, review_id):
    review = BookReview.query.get(review_id)

    if not review or review.book_id != isbn:
        return error_response("Review not found.", 404)

    return jsonify(review.to_dict()), 200


def create_receipt(user_id, book_id):
    existing_receipt = Receipt.query.filter_by(user_id=user_id, book_id=book_id).first()
    if existing_receipt:
        return error_response("Receipt already exists for this purchase.", 409)

    new_receipt = Receipt(user_id=user_id, book_id=book_id)
    db.session.add(new_receipt)
    db.session.commit()
    return jsonify({"message": "Receipt created successfully!"}), 201


@jwt_required()
def view_purchase_history(user_id):
    receipts = Receipt.query.filter_by(user_id=user_id).all()
    return jsonify([receipt.to_dict() for receipt in receipts]), 200


@jwt_required()
def respond_to_request(request_id):
    user_id = get_jwt_identity()
    user = get_user_or_error(user_id)
    is_admin_or_error(user)

    data = request.get_json()
    request_to_respond = AdminRequest.query.get(request_id)

    if not request_to_respond:
        return error_response("Request not found.", 404)

    request_to_respond.is_accepted = data.get("is_accepted", False)
    request_to_respond.review = data.get("review", "")
    request_to_respond.admin_id = user.user_id
    request_to_respond.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": "Request response recorded successfully!"}), 200


@jwt_required()
def view_requests():
    user_id = get_jwt_identity()
    user = get_user_or_error(user_id)
    is_admin_or_error(user)

    requests = AdminRequest.query.all()
    return jsonify([request.to_dict() for request in requests]), 200
