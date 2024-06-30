import machine
import time
import dht
import urequests
import network

dht_sensor = dht.DHT11(machine.Pin(15))
light_sensor = machine.ADC(27)
soil_moisture_sensor = machine.ADC(26)
relay = machine.Pin(2, machine.Pin.OUT)

red_led = machine.Pin(17, machine.Pin.OUT)
green_led = machine.Pin(18, machine.Pin.OUT)
blue_led = machine.Pin(19, machine.Pin.OUT)

minMoisture = 25000
maxMoisture = 56000
thresholdActivate = 46700
thresholdDeactivate = 28000

last_pump_time = 0
pump_cooldown = 600

def read_soil_moisture():
    return soil_moisture_sensor.read_u16()

def control_pump(state, soil_moisture):
    global last_pump_time
    current_time = time.time()
    if soil_moisture < thresholdDeactivate:
        relay.value(0)
    elif current_time - last_pump_time < pump_cooldown:
        pass
    else:
        relay.value(state)
        if state == 1:
            last_pump_time = current_time
            time.sleep(3)
            relay.value(0)

def control_rgb_led(red, green, blue):
    red_led.value(red)
    green_led.value(green)
    blue_led.value(blue)

ssid = 'YOUR_SSID'
password = 'YOUR_PASSWORD'
server_ip = 'YOUR_SERVER_IP'
server_port = 'YOUR_PORT'

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

while not wlan.isconnected():
    time.sleep(1)

def fetch_led_status():
    try:
        url = f'http://{server_ip}:{server_port}/api/control-led'
        response = urequests.get(url)
        if response.status_code == 200:
            led_status = response.json()
            control_rgb_led(led_status['red'], led_status['green'], led_status['blue'])
    except OSError:
        pass

def fetch_pump_status(soil_moisture):
    try:
        url = f'http://{server_ip}:{server_port}/api/control-pump'
        response = urequests.get(url)
        if response.status_code == 200:
            pump_status = response.json().get('pumpStatus')
            if pump_status == 'ON':
                control_pump(1, soil_moisture)
            else:
                control_pump(0, soil_moisture)
    except OSError:
        pass

while True:
    try:
        dht_sensor.measure()
        temp = dht_sensor.temperature()
        humidity = dht_sensor.humidity()
        light_value = light_sensor.read_u16()
        soil_moisture_value = read_soil_moisture()

        if soil_moisture_value > thresholdDeactivate:
            control_pump(1, soil_moisture_value)

        data = {
            'temp': temp,
            'humidity': humidity,
            'light': light_value,
            'soil_moisture': soil_moisture_value,
            'pump_status': 'ON' if soil_moisture_value < thresholdActivate else 'OFF'
        }

        try:
            url = f'http://{server_ip}:{server_port}/api/sensor-data'
            response = urequests.post(url, json=data)
        except OSError:
            continue

        fetch_led_status()
        fetch_pump_status(soil_moisture_value)

        time.sleep(120)
    except OSError:
        continue
