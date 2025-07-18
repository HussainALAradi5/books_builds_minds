import os
from flask import request, jsonify
from werkzeug.utils import secure_filename
from config import db
from auth import validate_token
from models.Book import Book
from models.User import User

UPLOAD_FOLDER = "../static/images/"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_book_image(book_id):
    token = request.headers.get("Authorization")
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "UnAuthories Access"}), 401
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return (
            jsonify(
                {"error": "Unauthorized: Only admins can upload or modify book images"}
            ),
            403,
        )
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file.save(file_path)
        book = Book.query.get(book_id)
        if not book:
            return jsonify({"error": "Book not found"}), 404
        book.book_image = file_path
        db.session.commit()
        return (
            jsonify(
                {"message": "Book cover uploaded successfully", "image_path": file_path}
            ),
            200,
        )
    return jsonify({"error": "Invalid file type"}), 400
