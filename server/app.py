# app.py
from flask import  jsonify, request 
from config import app, db
from models.User import User  
from auth import register_user, login_user,edit_user,validate_token,get_books,get_book,purchase_book,add_book,get_purchased_books

with app.app_context():
    db.create_all()  # Automatically creates missing tables

@app.route("/", methods=["GET"])
def home():
    return get_books()

@app.route("/register", methods=["POST"])
def register():
    return register_user()

@app.route("/login", methods=["POST"])
def login():
    return login_user()

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

@app.route("/profile/<int:user_id>/edit", methods=["PUT"])
def update_profile(user_id):
    return edit_user(user_id)

@app.route("/profile/<int:user_id>/books", methods=["GET"])
def view_purchased_books(user_id):
    return get_purchased_books(user_id)

@app.route("/book", methods=["POST"])
def create_book():
    return add_book()

@app.route("/book/<int:book_id>", methods=["GET"])
def book_details(book_id):
    return get_book(book_id)

@app.route("/book/<int:book_id>/purchase", methods=["POST"])
def buy_book(book_id):
    return purchase_book(book_id)


if __name__ == "__main__":
    app.run(debug=True)