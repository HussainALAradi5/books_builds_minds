from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
app=Flask(__name__)
CORS(app)
url=os.getenv('DATABASE_URL')
app.config["SQLALCHEMY_DATABASE_URI"]=url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
db=SQLAlchemy(app)