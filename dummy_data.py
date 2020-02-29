""" Module to create randomized dummy data for testing """
import random

def generateRandom(rand_type):
    dummy_data = 0
    if rand_type == 'illuminance':
        dummy_data = random.randrange(1, 10000)
    elif rand_type == 'temperature':
        dummy_data = random.randrange(50, 150)
    elif rand_type == 'humidity':
        dummy_data = random.randrange(75, 98)
    return dummy_data
