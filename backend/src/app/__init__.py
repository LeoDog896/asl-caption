from flask import Flask, request, Response, jsonify
from flask_cors import CORS

from werkzeug.datastructures.file_storage import FileStorage

# status codes

BAD_REQUEST = 400

# flask setup

app = Flask(__name__)
CORS(app, resources={
    '/api/*': {'origins': '*'}
})


# api routes

@app.route('/api/ping')
def api_ping():
    return {
        'message': 'Hello, Flask!'
    }


def allowed_file(file: FileStorage) -> bool:
    return '.' in file.filename and \
        file.filename.rsplit('.', 1)[1].lower()


@app.route('/api/upload', methods=['POST'])
def api_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'invalid request: no file part'}), 400
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'invalid request: no file supplied'}), 400
    if not allowed_file(file):
        return jsonify({'error': 'invalid request: unsupported file type'}), 400

    content = file.stream.read()
    msg = f'Received file "{file.filename}" of type "{file.mimetype}" with size of {len(content)}B!'
    return jsonify({'message': msg}), 200
