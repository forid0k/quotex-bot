const tableBody = document.querySelector("#signalTable tbody");

const marketSelect = document.getElementById("marketSelect");
const strategySelect = document.getElementById("strategySelect");

// Strategy-based signal logic (demo)
function generateSignal(strategy) {
  let rand = Math.random(); // 0 - 1
  switch (strategy) {
    case "EMA":
      // EMA strategy: 60% BUY, 40% SELL
      return rand < 0.6 ? "BUY" : "SELL";
    case "RSI":
      // RSI strategy: RSI > 70 SELL, RSI < 30 BUY
      return rand < 0.3 ? "BUY" : rand > 0.7 ? "SELL" : "HOLD";
    case "Volume":
      // Volume strategy: high volume BUY, low volume SELL
      return rand < 0.5 ? "BUY" : "SELL";
    case "Price Action":
      // Price Action: random but weighted
      return rand < 0.55 ? "BUY" : "SELL";
    default:
      return "BUY";
  }
}

function addSignalRow({ time, market, asset, timeframe, signal, strategy }) {
  const row = document.createElement("tr");
  let signalClass = "";
  if (signal === "BUY") signalClass = "signal-buy";
  else if (signal === "SELL") signalClass = "signal-sell";

  row.innerHTML = `
    <td>${time}</td>
    <td>${market}</td>
    <td>${asset}</td>
    <td>${timeframe}</td>
    <td class="${signalClass}">${signal}</td>
    <td>${strategy}</td>
  `;
  tableBody.prepend(row);
}

// Generate signal every 1 minute
setInterval(() => {
  const now = new Date().toLocaleTimeString();
  const asset = marketSelect.value;
  const strategy = strategySelect.value;

  const signal = generateSignal(strategy);

  addSignalRow({
    time: now,
    market: "Real Market",
    asset,
    timeframe: "1m",
    signal,
    strategy
  });
}, 60000);
