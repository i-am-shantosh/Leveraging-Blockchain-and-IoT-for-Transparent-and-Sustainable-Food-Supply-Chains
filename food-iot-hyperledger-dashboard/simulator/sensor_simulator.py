import requests
import time
import random

API_URL = "http://localhost:5000/logData"
LOGIN_URL = "http://localhost:5000/login"

# Auto-login to get JWT token
login_resp = requests.post(LOGIN_URL, json={"username": "admin", "password": "admin123"})
if login_resp.status_code != 200:
    print("Login failed:", login_resp.text)
    exit()

TOKEN = login_resp.json().get("token")
print("Using token:", TOKEN)

headers = {
    "Authorization": TOKEN,  # Pass JWT token
    "Content-Type": "application/json"
}

# Simulate sending sensor data every 5 seconds
while True:
    data = {
        "sensorId": "sensor1",
        "temperature": round(random.uniform(15, 30), 2),
        "humidity": round(random.uniform(40, 80), 2),
        "timestamp": str(int(time.time()))
    }
    try:
        response = requests.post(API_URL, json=data, headers=headers)
        print(f"Sent data: {data}, Response: {response.status_code}, {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    time.sleep(5)

