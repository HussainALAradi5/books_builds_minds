from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import jwt
from models.User import User
from models.Book import Book
from models.Review import Review
from models.Receipt import Receipt 
from models.AdminRequest import AdminRequest
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

def add_review(book_id):
    token = request.headers.get("Authorization")
    user_id = validate_token(token)

    if not user_id:
        return error_response("Invalid or missing token", 401)

    user = User.query.get(user_id)
    book = Book.query.get(book_id)

    if not book:
        return error_response("Book not found", 404)

    if user not in book.purchased_by_users:
        return error_response("Unauthorized: You can only review books you have purchased", 403)

    data = request.json
    rating = data.get("rating")
    comment_text = data.get("comment") 
    if rating is None or not (0 <= rating <= 5):
        return error_response("Invalid rating. Must be between 0 and 5", 400)
    if not comment_text or len(comment_text.strip()) < 10:
        print(f"Received comment: {comment_text} (Length: {len(comment_text.strip())})")
        return error_response("Review text must be at least 10 characters", 400)

    new_review = Review(
        user_id=user_id,
        book_id=book_id,
        written_time=datetime.utcnow(),
        last_edit=None,
        rating=rating,
        comment=comment_text  
    )

    db.session.add(new_review)
    db.session.commit()

    return jsonify({"message": "Review added successfully", "review": new_review.to_dict()}), 201

def edit_review(review_id):
    token = request.headers.get("Authorization")
    user_id = validate_token(token)

    if not user_id:
        return error_response("Invalid or missing token", 401)

    review = Review.query.get(review_id)

    if not review:
        return error_response("Review not found", 404)

    if review.user_id != user_id:
        return error_response("Unauthorized: You can only edit your own reviews", 403)

    data = request.json
    rating = data.get("rating")
    comment_text = data.get("comment") 

    if rating is not None and not (0 <= rating <= 5):
        return error_response("Invalid rating. Must be between 0 and 5", 400)
    if comment_text and len(comment_text.strip()) < 10:
        return error_response("Review text must be at least 10 characters", 400)

    review.rating = rating if rating is not None else review.rating
    review.comment = comment_text if comment_text else review.comment  
    review.last_edit = datetime.utcnow()

    book_id = review.book_id  # ✅ Directly fetch book_id from review

    db.session.commit()

    return jsonify({
        "message": "Review updated successfully",
        "review": review.to_dict(),
        "book_id": book_id  # ✅ Return book_id if needed
    }), 200

def delete_review(review_id):
    token = request.headers.get("Authorization")
    user_id = validate_token(token)

    if not user_id:
        return error_response("Invalid or missing token", 401)

    review = Review.query.get(review_id)

    if not review:
        return error_response("Review not found", 404)

    if review.user_id != user_id:
        return error_response("Unauthorized: You can only delete your own reviews", 403)

    db.session.delete(review)
    db.session.commit()

    return jsonify({"message": "Review deleted successfully"}), 200

def get_book_reviews(book_id):
    book = Book.query.get(book_id)

    if not book:
        return error_response("Book not found", 404)

    reviews = [review.to_dict() for review in book.reviews]

    return jsonify({"message": "Reviews retrieved successfully", "reviews": reviews}), 200

def get_admin_requests():
    token = request.headers.get("Authorization")
    user_id = validate_token(token)
    if not user_id:
        return error_response("Invalid or missing token", 401)
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return error_response("Unauthorized: Only admins can view admin requests", 403)
    requests = [req.to_dict() for req in AdminRequest.query.all()]

    return jsonify({"message": "Admin requests retrieved successfully", "requests": requests}), 200

def submit_admin_request():
    token = request.headers.get("Authorization")
    user_id = validate_token(token)

    if not user_id:
        return error_response("Invalid or missing token", 401)

    user = User.query.get(user_id)
    if not user or not user.is_active or user.is_admin:
        return error_response("Unauthorized: Only active non-admin users can request admin status", 403)

    data = request.json
    reason = data.get("reason_for_request")

    if not reason:
        return error_response("Reason for request is required", 400)

    new_request = AdminRequest(
        requester_id=user_id,
        reason_for_request=reason,
        is_accepted=None,  
        review_time=None,
        reviewed_by_user_id=None
    )

    db.session.add(new_request)
    db.session.commit()

    return jsonify({"message": "Admin request submitted successfully", "request": new_request.to_dict()}), 201

def review_admin_request(request_id):
    token = request.headers.get("Authorization")
    user_id = validate_token(token)

    if not user_id:
        return error_response("Invalid or missing token", 401)

    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return error_response("Unauthorized: Only admins can review admin requests", 403)

    admin_request = AdminRequest.query.get(request_id)
    if not admin_request:
        return error_response("Admin request not found", 404)
    if admin_request.is_accepted is not None:
        return error_response("This request has already been reviewed", 400)

    data = request.json
    decision = data.get("is_accepted")

    if decision not in [True, False]:
        return error_response("Invalid decision value. Must be 'True' (accept) or 'False' (reject)", 400)
    admin_request.is_accepted = decision
    admin_request.review_time = datetime.utcnow()
    admin_request.reviewed_by_user_id = user_id
    db.session.commit()
    return jsonify({
        "message": f"Admin request {'accepted' if decision else 'rejected'} successfully",
        "request": admin_request.to_dict()
    }), 200