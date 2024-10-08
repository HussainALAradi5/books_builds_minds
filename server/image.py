import os
from flask import request, jsonify
from werkzeug.utils import secure_filename
import logging

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "../uploads/images")


os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_image():
    logging.info("Upload image function called.")

    if "file" not in request.files:
        logging.error("No file part in request.")
        return jsonify({"message": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        logging.error("No selected file.")
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        logging.info(f"File {filename} uploaded successfully.")
        return (
            jsonify({"message": "Image uploaded successfully!", "filename": filename}),
            201,
        )
    else:
        logging.error("File type not allowed.")
        return jsonify({"message": "File type not allowed"}), 400


def read_image(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(file_path):
        return jsonify({"image": file_path}), 200
    else:
        return jsonify({"message": "Image not found"}), 404


def update_image(filename):
    return upload_image()
