import RPi.GPIO as GPIO
import time

#GPIO setup
sensor_port = 21
GPIO.setmode(GPIO.BCM)
GPIO.setup(sensor_port, GPIO.IN)


def sensor_callback(sensor_port):
    print(sensor_port)
    if GPIO.input(sensor_port):
        print("no water detected")
    else:
        print("water detected")


def read_now(sensor_port):
    return GPIO.input(sensor_port)


def main():
    GPIO.add_event_detect(sensor_port, GPIO.BOTH, bouncetime=300)
    GPIO.add_event_callback(sensor_port, callback)

    while True:
        read_now(sensor_port)
        time.sleep(10)

if __name__ == '__main__':
    main()
