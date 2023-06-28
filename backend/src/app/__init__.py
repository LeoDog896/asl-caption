from flask import Flask, Response, request, jsonify
from flask_cors import CORS

#from gradio_client import Client
import requests
import json


# config

TEMP_FILE = './temp'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


# flask setup

app = Flask(__name__)
CORS(app, resources={
    '/api/*': {'origins': '*'}
})


# gradio client setup

PREDICT_URL = 'https://diego7167-asl-caption.hf.space/api/predict'

# api routes

def allowed_file(filename: str) -> bool:
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/upload', methods=['POST'])
def api_upload():
    if request.json['url']:
        header, data = request.json['url'].split('base64,', 1)

        r = requests.post(PREDICT_URL, json={ "data": [data] })
        print(r.text)
        
        return Response(json.dumps(r.json()['data'][0]), headers={
            "Content-Type": "application/json"
        })
    else:
        return 'not ok!'
