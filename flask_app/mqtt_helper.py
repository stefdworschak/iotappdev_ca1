""" Module to host all the MQTT functionality the Flask App will use

"""
import os
import paho.mqtt.client as mqtt

client = None

# MQTT settings
BROKER_ADDRESS = os.environ.get('BROKER_ADDRESS', 'No value set')
LISTEN_CLIENT_ID = os.environ.get('LISTEN_CLIENT_ID', 'No value set')
SUBSCRIBER = os.environ.get('SUBSCRIBER', 'No value set')

listening = True

def on_message(client, userdata, message):
    return message

def on_disconnect(client, userdata, reasonCode, properties):
    # TODO: Add functionality
    print('Disconnected from MQTT Broker')
    print('Reason Code=%s' % reasonCode)
    print('Properties=%s' % properties)


def start_client(client_id):
    """ Start MQTT client, connect to broker, start the loop and set all
    required MQTT methods.

    """
    client = mqtt.Client(client_id)
    client.connect(BROKER_ADDRESS)
    # Set all custom MQTT methods
    client.on_message=on_message
    client.on_disconnect=on_disconnect
    return client

def listen():
    """ Listen for new messages on subscribed topic, start the publisher and

    """
    client = start_client(LISTEN_CLIENT_ID)
    client.subscribe(SUBSCRIBER)
    while listening:
        client.loop(.1)
    