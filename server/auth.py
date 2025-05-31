from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
from models.User import User
from config import app, db

SECRET_KEY = app.config["JWT_SECRET_KEY"]
def generate_token(user_id):
    return jwt.encode({"user_id": user_id}, SECRET_KEY, algorithm="HS256")

def validate_password(password):
    return sum(c.isalpha() for c in password) >= 5 and sum(c.isdigit() for c in password) >= 3

def success_response(message, status_code=200):
    return jsonify({"message": message}), status_code

def error_response(message, status_code=400):
    return jsonify({"error": message}), status_code

def register_user():
    data = request.json
    user_name = data.get("user_name").lower()
    email = data.get("email").lower()
    password = data.get("password")
    user_image = data.get("user_image", None)

    if User.query.filter_by(user_name=user_name).first():
        return error_response("Username already exists", 400)
    if User.query.filter_by(email=email).first():
        return error_response("Email already exists", 400)

    if not validate_password(password):
        return error_response("Password must contain at least 3 numbers and 5 letters", 400)

    hashed_password = generate_password_hash(password)
    new_user = User(user_name=user_name, email=email, password_digest=hashed_password, user_image=user_image)

    db.session.add(new_user)
    db.session.commit()
    return success_response("User registered successfully", 201)

def login_user():
    data = request.json
    identifier = data.get("user_name_or_email").lower()
    password = data.get("password")

    user = User.query.filter((User.user_name == identifier) | (User.email == identifier)).first()
    
    if not user or not check_password_hash(user.password_digest, password):
        return error_response("Invalid credentials", 401)

    token = generate_token(user.user_id)
    return jsonify({"message": "Login successful", "token": token}), 200

# def validate_token(token):
#     if not token:
#         return False
#     try:
#         decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#         return User.query.get(decoded_token.get("user_id")) is not None
#     except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
#         return False

def validate_token(token):
    """Returns user ID if the token is valid, else None."""
    if not token:
        return None

    try:
        token = token.replace("Bearer ", "")  # ✅ Remove "Bearer " prefix
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded_token.get("user_id")  # ✅ Return user ID from token
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None