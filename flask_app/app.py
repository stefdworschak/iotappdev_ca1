import json
import os

from flask import Flask, render_template, jsonify

app = Flask(__name__, static_url_path='/static')


@app.route('/')
def index(method=['GET']):
    return render_template('index.html')


@app.route('/api')
def api(method=['GET','POST']):
    """This is the function you can put your API logic into

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