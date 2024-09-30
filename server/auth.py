from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, JWTManager
from models.User import User
from config import db, app

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
