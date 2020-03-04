import json
import os
from threading import Thread

from flask import Flask, render_template, jsonify

import mqtt_helper

app = Flask(__name__, static_url_path='/static')


@app.route('/')
def index(method=['GET']):
    return render_template('index.html')


@app.route('/start_listener')
def start_listening(method=['POST']):
    try:
        listening_thread=Thread(target=mqtt_helper.listen)
        return json.dumps({'listenting': True})
    except Exception: # TODO: Change to a more accurate error
        return json.dumps({'listenting': False})

@app.route('/api')
def api(method=['GET','POST']):
    """Listen to data from MQTT and return it

    Returns a JSON object
    """
    temperature_readings = [
        {
            'sensor_type' :'temp',
            'reading': 23
        },
        {
            'sensor_type' :'temp',
            'reading': 24
        },
        {
            'sensor_type' :'temp',
            'reading': 21
        },
        {
            'sensor_type' :'temp',
            'reading': 20
        },
        {
            'sensor_type' :'temp',
            'reading': 18
        }
    ]
    return json.dumps(temperature_readings)


if __name__ == '__main__':
    app.run(port=8080, debug=True)