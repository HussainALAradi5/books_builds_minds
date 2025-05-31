from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import os
from dotenv import load_dotenv
import psycopg2
from urllib.parse import urlparse

load_dotenv('../.env')
app = Flask(__name__)
CORS(app)
url = os.getenv('DATABASE_URL')
secret_key = os.getenv('SECRET_KEY')
app.config["SQLALCHEMY_DATABASE_URI"] = url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', secret_key)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
def create_database_if_not_exists():
    result = urlparse(url)
    db_name = result.path[1:]  
    db_user = result.username
    db_password = result.password
    db_host = result.hostname
    db_port = result.port
    try:
        conn = psycopg2.connect(
            dbname="postgres",  
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port
        )
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(f"SELECT 1 FROM pg_database WHERE datname='{db_name}'")
        exists = cur.fetchone()
        if exists:
            print(f"Database '{db_name}' already exists.")
        else:
            print(f"Database '{db_name}' does not exist. Creating it...")
            cur.execute(f"CREATE DATABASE {db_name}")
            print(f"Database '{db_name}' created successfully.")
        cur.close()
        conn.close()
    except Exception as e:
        print("Failed to connect to PostgreSQL server:", e)
create_database_if_not_exists()
with app.app_context():
    try:
        db.engine.connect()
        print("Database connection successful.")
    except Exception as event:
        print("Database connection failed:", event)