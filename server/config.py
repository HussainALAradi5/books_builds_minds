
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv  

load_dotenv('../.env')  

app = Flask(__name__)
CORS(app)

url = os.getenv('DATABASE_URL')
secret_key = os.getenv('SECRET_KEY')

key=os.getenv('JWT_SECRET_KEY', secret_key)  


app.config["SQLALCHEMY_DATABASE_URI"] = url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  
app.config['JWT_SECRET_KEY'] = key

db = SQLAlchemy(app)


with app.app_context():
    try:
        db.engine.connect()
        print("Database connection successful.")
    except Exception as event:
        print("Database connection failed:", event)
