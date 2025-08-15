// strategy.js

// ===== Helper Functions =====

// EMA Calculation
function EMA(prices, period) {
  const k = 2 / (period + 1);
  let emaArray = [prices[0]]; // start with first price
  for (let i = 1; i < prices.length; i++) {
    emaArray.push(prices[i] * k + emaArray[i - 1] * (1 - k));
  }
  return emaArray;
}

// RSI Calculation
function RSI(prices, period = 14) {
  let gains = 0, losses = 0;
  let rsiArray = [];

  for (let i = 1; i <= period; i++) {
    let change = prices[i] - prices[i - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  let rs = avgGain / (avgLoss === 0 ? 1 : avgLoss);
  rsiArray[period] = 100 - 100 / (1 + rs);

  for (let i = period + 1; i < prices.length; i++) {
    let change = prices[i] - prices[i - 1];
    let gain = change > 0 ? change : 0;
    let loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgGain / (avgLoss === 0 ? 1 : avgLoss);
    rsiArray[i] = 100 - 100 / (1 + rs);
  }

  return rsiArray;
}

// ===== Strategy Function =====
function generateSignals(candles) {
  // candles = [{open, high, low, close, volume}, ...]

  const closePrices = candles.map(c => c.close);
  const volumeArray = candles.map(c => c.volume);

  const emaFast = EMA(closePrices, 9);
  const emaSlow = EMA(closePrices, 21);
  const rsi = RSI(closePrices, 14);

  let signals = [];

  for (let i = 21; i < candles.length; i++) {
    let signal = null;

    // Trend check
    const uptrend = emaFast[i] > emaSlow[i];
    const downtrend = emaFast[i] < emaSlow[i];

    // Volume spike check (current > previous 3 candles avg)
    const avgVol = (volumeArray[i - 1] + volumeArray[i - 2] + volumeArray[i - 3]) / 3;
    const volSpike = volumeArray[i] > avgVol;

    // Price Action simple check (bullish/bearish candle)
    const bullishCandle = candles[i].close > candles[i].open;
    const bearishCandle = candles[i].close < candles[i].open;

    // ===== Buy Signal =====
    if (uptrend && rsi[i] < 60 && bullishCandle && volSpike) {
      signal = 'BUY';
    }

    // ===== Sell Signal =====
    if (downtrend && rsi[i] > 40 && bearishCandle && volSpike) {
      signal = 'SELL';
    }

    signals.push({
      index: i,
      signal: signal,
      price: candles[i].close
    });
  }

  return signals;
}

// ===== Example Usage =====
/*
const candles = [
  {open:1, high:1.1, low:0.9, close:1.05, volume:1000},
  ...
];
const signals = generateSignals(candles);
console.log(signals);
*/

module.exports = { generateSignals };

