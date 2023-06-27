from flask import Flask, request, jsonify
from flask_cors import CORS

from werkzeug import exceptions
from werkzeug.utils import secure_filename

from gradio_client import Client


# config

TEMP_FILE = './temp'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


# flask setup

app = Flask(__name__)
CORS(app, resources={
    '/api/*': {'origins': '*'}
})


# gradio client setup

client = Client('https://diego7167-asl-caption.hf.space/', serialize=False)

# api routes

def allowed_file(filename: str) -> bool:
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/upload', methods=['POST'])
def api_upload():
    if request.json['url']:
        header, data = request.json['url'].split('base64,', 1)

        response = client.submit(data, api_name='/predict')
        
        return jsonify(response.result())
    else:
        return 'not ok!'
