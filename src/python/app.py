from flask import Flask
from flask import request
from flask_cors import CORS
from main import get_route, default_handler
import json
import os

app = Flask(__name__)
cors = CORS(app)

@app.route("/", methods = ['GET', 'POST'])
def get_data():
    if request.method == 'POST':
        start_locatation = request.form.get('start_location')
        end_location = request.form.get('end_location')
        route = get_route(start_locatation, end_location)
    return json.dumps(route, default=default_handler)

@app.route("/get_ip", methods = ['GET'])
def get_ip():
    if request.method == 'GET':
        return os.getenv("PUBLIC_IP")

if __name__ == '__main__':
    app.run(debug=True, port=5000)