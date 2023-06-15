from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/hello")
@cross_origin()
def hello_api():
    return {
        "message": "Hello, Flask!"
    }
