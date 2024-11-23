from flask import jsonify, request
from config import app, db
from auth import (
    register,
    login,
    edit_user,
    delete_user,
    user_details,
    purchase_book,
    view_book_details,
    add_book,
    edit_book,
    remove_book,
    is_admin_or_error,
    view_purchase_history,
)
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging
from flask_cors import CORS
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

@app.route('/user/<int:user_id>/profile', methods=['GET'])
@jwt_required()
def handle_user_details(user_id):
    try:
        return user_details(user_id)
    except Exception as event:
        logging.error(f"User details error: {str(event)}")
        return jsonify({"message": "Fetch user details failed", "error": str(event)}), 500

@app.route('/books/<int:isbn>', methods=['GET'])
@jwt_required()
def handle_view_book_details(isbn):
    try:
        return view_book_details(isbn)
    except Exception as event:
        logging.error(f"View book details error: {str(event)}")
        return jsonify({"message": "Fetch book details failed", "error": str(event)}), 500

@app.route('/books/<int:isbn>/purchase', methods=['POST'])
@jwt_required()
def handle_purchase_book(isbn):
    try:
        return purchase_book(isbn)
    except Exception as event:
        logging.error(f"Purchase book error: {str(event)}")
        return jsonify({"message": "Purchase failed", "error": str(event)}), 500

@app.route('/books', methods=['POST'])
@jwt_required()
def handle_add_book():
    if not is_admin_or_error():
        return jsonify({"message": "Admin access required."}), 403
    try:
        data = request.get_json()
        return add_book(data)
    except Exception as event:
        logging.error(f"Add book error: {str(event)}")
        return jsonify({"message": "Add book failed", "error": str(event)}), 500

@app.route('/books/<int:isbn>', methods=['PUT'])
@jwt_required()
def handle_edit_book(isbn):
    if not is_admin_or_error():
        return jsonify({"message": "Admin access required."}), 403
    try:
        data = request.get_json()
        return edit_book(isbn, data)
    except Exception as event:
        logging.error(f"Edit book error: {str(event)}")
        return jsonify({"message": "Edit book failed", "error": str(event)}), 500

@app.route('/books/<int:isbn>', methods=['DELETE'])
@jwt_required()
def handle_remove_book(isbn):
    if not is_admin_or_error():
        return jsonify({"message": "Admin access required."}), 403
    try:
        return remove_book(isbn)
    except Exception as event:
        logging.error(f"Remove book error: {str(event)}")
        return jsonify({"message": "Remove book failed", "error": str(event)}), 500

@app.route('/books/<int:isbn>/<int:review_id>', methods=['GET'])
@jwt_required()
def handle_view_review(isbn, review_id):
    try:
        return view_review(isbn, review_id)
    except Exception as event:
        logging.error(f"View review error: {str(event)}")
        return jsonify({"message": "View review failed", "error": str(event)}), 500

@app.route('/books/<int:isbn>/reviews', methods=['POST'])
@jwt_required()
def handle_add_review(isbn):
    try:
        return add_review(isbn)
    except Exception as event:
        logging.error(f"Add review error: {str(event)}")
        return jsonify({"message": "Add review failed", "error": str(event)}), 500

@app.route('/books/<int:isbn>/<int:review_id>', methods=['PUT'])
@jwt_required()
def handle_edit_review(isbn, review_id):
    try:
        return edit_review(isbn, review_id)
    except Exception as event:
        logging.error(f"Edit review error: {str(event)}")
        return jsonify({"message": "Edit review failed", "error": str(event)}), 500

@app.route('/books/<int:isbn>/<int:review_id>', methods=['DELETE'])
@jwt_required()
def handle_remove_review(isbn, review_id):
    try:
        return remove_review(isbn, review_id)
    except Exception as event:
        logging.error(f"Remove review error: {str(event)}")
        return jsonify({"message": "Remove review failed", "error": str(event)}), 500

@app.route('/receipts', methods=['GET'])
@jwt_required()
def handle_view_purchase_history():
    user_id = get_jwt_identity()
    return view_purchase_history(user_id)

CORS(app)
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
