import os
from flask import request, jsonify
from werkzeug.utils import secure_filename
from config import db
from models.Book import Book

UPLOAD_FOLDER = "../static/images/"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_book_image(book_id):
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    print(f"Request files: {request.files}")
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        book = Book.query.get(book_id)
        if not book:
            return jsonify({"error": "Book not found"}), 404
        book.book_image = file_path
        db.session.commit()
        return jsonify({"message": "Book cover uploaded successfully", "image_path": file_path}), 200
    return jsonify({"error": "Invalid file type"}), 400