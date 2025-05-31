# auth.py
from models.User import User
from config import app,db
from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os

SECRET_KEY = os.getenv('JWT_SECRET_KEY')

def register_user():
    data = request.json
    user_name = data.get("user_name").lower()
    email = data.get("email").lower()
    password = data.get("password")
    user_image = data.get("user_image", None)

    # Ensure uniqueness
    if User.query.filter_by(user_name=user_name).first():
        return jsonify({"error": "Username already exists"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    # Validate password
    if not validate_password(password):
        return jsonify({"error": "Password must contain at least 3 numbers and 5 letters"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(user_name=user_name, email=email, password_digest=hashed_password, user_image=user_image)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

def login_user():
    data = request.json
    identifier = data.get("user_name_or_email").lower()
    password = data.get("password")

    user = User.query.filter((User.user_name == identifier) | (User.email == identifier)).first()
    
    if not user or not check_password_hash(user.password_digest, password):
        return jsonify({"error": "Invalid credentials"}), 401
    token = jwt.encode({"user_id": user.user_id},app.config["JWT_SECRET_KEY"], algorithm="HS256")

    return jsonify({"message": "Login successful", "token": token}), 200

def validate_password(password):
    words_count = sum(c.isalpha() for c in password)
    numbers_count = sum(c.isdigit() for c in password)
    return words_count >= 5 and numbers_count >= 3