from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    "/api/*": {"origins": "*"}
})


@app.route("/api/ping")
def api_ping():
    return {
        "message": "Hello, Flask!"
    }
