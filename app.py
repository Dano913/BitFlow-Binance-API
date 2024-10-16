from flask import Flask, flash, redirect, render_template, request, jsonify
from flask_cors import CORS
import config, csv, datetime
from binance.client import Client
from binance.enums import *
from datetime import datetime
app = Flask(__name__) 
app.secret_key = b'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
client = Client(config.API_KEY, config.API_SECRET, tld='com')
CORS(app) 


@app.route('/')
def index():
    title = 'BitFlow'
    
    return render_template('index.html', title=title)

@app.route('/history')
def history():

    now = datetime.now()
     
    current_date = now.strftime("%m/%d/%Y, %H:%M:%S")  
    
    candlesticks = client.get_historical_klines("BTCUSDT", Client.KLINE_INTERVAL_15MINUTE, "10 Oct, 2024", current_date)

    processed_candlesticks = []

    for data in candlesticks:
        candlestick = { 
            "time": (data[0] / 1000) + 7200, 
            "open": data[1],
            "high": data[2], 
            "low": data[3], 
            "close": data[4]
        }

        processed_candlesticks.append(candlestick)

    return jsonify(processed_candlesticks)

if __name__ == '__main__':
    app.run(debug=True)