# app.py
from flask import  jsonify, request 
from config import app, db
from models.User import User  
from upload import upload_book_image
from auth import register_user, login_user,edit_user,validate_token,get_books,get_book,purchase_book,add_book,get_purchased_books,get_admin_requests, submit_admin_request,review_admin_request,add_review,get_book_reviews,edit_review,delete_review

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

@app.route("/book/<int:book_id>/review", methods=["POST"])
def create_review(book_id):
    return add_review(book_id)

@app.route("/book/<int:book_id>/review/<int:review_id>", methods=["PUT"])
def update_review(book_id,review_id):
    return edit_review(review_id)

@app.route("/book/<int:book_id>/review/<int:review_id>", methods=["DELETE"])
def remove_review(book_id,review_id):
    return delete_review(review_id)

@app.route("/book/<int:book_id>/review/", methods=["GET"])  
def fetch_book_reviews(book_id):
    return get_book_reviews(book_id)

@app.route("/admin-requests", methods=["GET"])
def view_admin_requests():
    return get_admin_requests()

@app.route("/admin-requests", methods=["POST"])
def create_admin_request():
    return submit_admin_request()

@app.route("/admin-requests/<int:request_id>", methods=["PATCH"])
def review_request(request_id):
    return review_admin_request(request_id)

@app.route("/upload/book/<int:book_id>", methods=["POST"])
def upload_book(book_id):
    return upload_book_image(book_id)

if __name__ == "__main__":
    app.run(debug=True)