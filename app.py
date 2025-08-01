from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)  # WebPanel থেকে JSON access করার জন্য

# সর্বশেষ সিগন্যাল স্টোর করার জন্য
signals = []

@app.route("/")
def home():
    return "✅ Signal API is running!"

@app.route("/signal", methods=["POST"])
def receive_signal():
    data = request.get_json()
    if data:
        data["timestamp"] = time.strftime('%Y-%m-%d %H:%M:%S')
        signals.append(data)
        print("[RECEIVED SIGNAL]", data)
        return jsonify({"status": "success", "message": "Signal received"}), 200
    else:
        return jsonify({"status": "error", "message": "No data provided"}), 400

@app.route("/get-signals", methods=["GET"])
def get_signals():
    return jsonify(signals[-10:])  # সর্বশেষ ১০টা সিগন্যাল পাঠাবে

if __name__ == "__main__":
    app.run(debug=True, port=5000)
