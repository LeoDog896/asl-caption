from flask import Flask, request, jsonify
from flask_cors import CORS

from werkzeug import exceptions
from werkzeug.utils import secure_filename

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


@app.route('/api/upload', methods=['POST'])
def api_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'invalid request: no file part'}), exceptions.BadRequest.code
    file = request.files.get('file')

    if file is None or file.filename == '':
        return jsonify({'error': 'invalid request: no file supplied'}), exceptions.BadRequest.code

    filename = secure_filename(file.filename)

    content = file.stream.read()
    msg = f'Received file "{filename}" of type "{file.mimetype}" with size of {len(content)}B!'
    return jsonify({'message': msg}), 200
