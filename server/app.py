# app.py
from flask import Flask, jsonify 
from config import app, db
from models.User import User  # Import your model
from auth import register_user, login_user
from config import secret_key
with app.app_context():
    db.create_all()  # Automatically creates missing tables

@app.route("/register", methods=["POST"])
def register():
    return register_user()

@app.route("/login", methods=["POST"])
def login():
    return login_user()

@app.route("/profile/<int:user_id>", methods=["GET"])
def profile(user_id):
    user = User.query.filter_by(user_id=user_id).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200

if __name__ == "__main__":
    app.run(debug=True)