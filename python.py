import requests

signal = {
    "asset": "EURUSD",
    "signal": "BUY",
    "time": "1M",
    "strategy": "EMA"
}

res = requests.post("http://localhost:5000/signal", json=signal)
print(res.json())
