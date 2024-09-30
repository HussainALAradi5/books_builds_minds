from flask import Flask, jsonify
from config import app, db
from auth import register, login, edit_user, delete_user, user_details
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

logging.basicConfig(level=logging.INFO)

@app.route('/register', methods=['POST'])
def handle_register():
    try:
        return register()
    except Exception as event:
        logging.error(f"Registration error: {str(event)}")
        return jsonify({"message": "Registration failed", "error": str(event)}), 500 

@app.route('/login', methods=['POST'])
def handle_login():
    try:
        return login()
    except Exception as event:
        logging.error(f"Login error: {str(event)}")
        return jsonify({"message": "Login failed", "error": str(event)}), 500 

@app.route('/<int:user_id>/edit/', methods=['PUT'])  
@jwt_required()  
def handle_edit(user_id):
    try:
        return edit_user(user_id) 
    except Exception as event:
        logging.error(f"Edit user error: {str(event)}")
        return jsonify({"message": "Edit user failed", "error": str(event)}), 500 

@app.route('/<int:user_id>/delete/', methods=['DELETE'])  
@jwt_required()  
def handle_delete(user_id):
    try:
        return delete_user(user_id)  
    except Exception as event:
        logging.error(f"Delete user error: {str(event)}")
        return jsonify({"message": "Delete user failed", "error": str(event)}), 500  

@app.route('/<int:user_id>/profile', methods=['GET'])
@jwt_required()  
def handle_user_details():
    user_id = get_jwt_identity() 
    try:
        return user_details(user_id)  
    except Exception as event:
        logging.error(f"User details error: {str(event)}")
        return jsonify({"message": "Fetch user details failed", "error": str(event)}), 500  

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
    app.run(debug=True)
