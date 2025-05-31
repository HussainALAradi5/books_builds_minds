# app.py
from flask import Flask, jsonify, request 
from config import app, db
from models.User import User  # Import your model
from auth import register_user, login_user,validate_token
from config import secret_key
with app.app_context():
    db.create_all()  # Automatically creates missing tables

@app.route("/register", methods=["POST"])
def register():
    return register_user()

@app.route("/login", methods=["POST"])
def login():
    return login_user()

# @app.route("/profile/<int:user_id>", methods=["GET"])
# def profile(user_id):
#     token = request.headers.get("Authorization")  

#     if not validate_token(token):
#         return jsonify({"error": "Invalid or missing token"}), 401

#     user = User.query.filter_by(user_id=user_id).first()
    
#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     return jsonify(user.to_dict()), 200
@app.route("/profile/<int:user_id>", methods=["GET"])
def profile(user_id):
    token = request.headers.get("Authorization") 

    user_id_from_token = validate_token(token)
    if not user_id_from_token:
        return jsonify({"error": "Invalid or missing token"}), 401

    if user_id != user_id_from_token:
        return jsonify({"error": "Unauthorized access"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200



if __name__ == "__main__":
    app.run(debug=True)