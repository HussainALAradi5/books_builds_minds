# app.py
from config import app, db
from models.User import User  # Import your model
from auth import register_user, login_user
from config import secret_key
print(f"secret_key:{secret_key}")  # This should output a valid string
# Ensure tables exist when the app starts
with app.app_context():
    db.create_all()  # Automatically creates missing tables

@app.route("/register", methods=["POST"])
def register():
    return register_user()

@app.route("/login", methods=["POST"])
def login():
    return login_user()

if __name__ == "__main__":
    app.run(debug=True)