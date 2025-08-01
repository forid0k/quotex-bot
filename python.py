import requests

signal = {
    "asset": "EURUSD",
    "signal": "BUY",
    "time": "1M",
    "strategy": "EMA"
}

res = requests.post("https://forid0k.github.io/quotex-bot/", json=signal)
print(res.json())
