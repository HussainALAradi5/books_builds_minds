# app.py
from flask import jsonify, request
from config import app, db
from models.User import User
from upload import upload_book_image
from auth import (
    register_user,
    login_user,
    edit_user,
    user_details,
    get_books,
    get_book,
    purchase_book,
    add_book,
    get_purchased_books,
    get_admin_requests,
    submit_admin_request,
    review_admin_request,
    add_review,
    get_book_reviews,
    edit_review,
    delete_review,
)

with app.app_context():
    db.create_all()


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
    return user_details(user_id)


@app.route("/profile/<int:user_id>/edit", methods=["PUT"])
def update_profile(user_id):
    return edit_user(user_id)


@app.route("/profile/<int:user_id>/books", methods=["GET"])
def view_purchased_books(user_id):
    return get_purchased_books(user_id)


@app.route("/book", methods=["POST"])
def create_book():
    return add_book()


@app.route("/book/<string:slug>", methods=["GET"])
def book_details(slug):
    return get_book(slug)


@app.route("/book/<string:slug>/purchase", methods=["POST"])
def buy_book(slug):
    return purchase_book(slug)


@app.route("/book/<string:slug>/review", methods=["POST"])
def create_review(slug):
    return add_review(slug)


@app.route("/book/<string:slug>/review/<int:review_id>", methods=["PUT"])
def update_review(slug, review_id):
    return edit_review(review_id)


@app.route("/book/<string:slug>/review/<int:review_id>", methods=["DELETE"])
def remove_review(slug, review_id):
    return delete_review(review_id)


@app.route("/book/<string:slug>/review/", methods=["GET"])
def fetch_book_reviews(slug):
    return get_book_reviews(slug)


@app.route("/admin-requests", methods=["GET"])
def view_admin_requests():
    return get_admin_requests()


@app.route("/admin-requests", methods=["POST"])
def create_admin_request():
    return submit_admin_request()


@app.route("/admin-requests/<int:request_id>", methods=["PATCH"])
def review_request(request_id):
    return review_admin_request(request_id)


@app.route("/upload/book/<int:slug>", methods=["POST"])
def upload_book(slug):
    return upload_book_image(slug)


if __name__ == "__main__":
    app.run(debug=True)
