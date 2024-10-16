
var chart = LightweightCharts.createChart(document.getElementById('chart'), {
	width: 1800,
  	height: 900,
	layout: {
		background: {
            color: '#000'
        },
		textColor: 'rgba(255, 255, 255, 0.9)',
	},
	grid: {
		vertLines: {
			color: 'rgba(197, 203, 206, 0.5)',
		},
		horzLines: {
			color: 'rgba(197, 203, 206, 0.5)',
		},
	},
	crosshair: {
		mode: LightweightCharts.CrosshairMode.Normal,
	},
	priceScale: {
		borderColor: 'rgba(197, 203, 206, 0.8)',
	},
	timeScale: {
		borderColor: 'rgba(197, 203, 206, 0.8)',
        timeVisible: true,
        secondsVisible: false,
	},
});

var candleSeries = chart.addCandlestickSeries({
	upColor: 'green',
	downColor: 'red', 
	borderDownColor: 'black',
	borderUpColor: 'black',
	wickDownColor: 'red',
	wickUpColor: 'green',
});

fetch('http://localhost:5000/history')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);

        candleSeries.setData(data);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });




var binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_15m");

let previousClose = null;


binanceSocket.onmessage = function (event) {	
	var message = JSON.parse(event.data);

	var candlestick = message.k;

    var currentClose = parseFloat(candlestick.c);
    
	var priceDisplay = document.getElementById('price-display');

    if (previousClose !== null) {
        if (currentClose > previousClose) {
            priceDisplay.style.color = 'green';
            priceDisplay.textContent = `${currentClose.toFixed(2)}$`;
        } else if (currentClose < previousClose) {
            priceDisplay.style.color = 'red';
            priceDisplay.textContent = `${currentClose.toFixed(2)}$`;
        } else {
            priceDisplay.textContent = `${currentClose.toFixed(2)}$`;
        }
    } else {
        priceDisplay.textContent = `${currentClose.toFixed(2)}$`;
        priceDisplay.style.color = 'white';
    }


    previousClose = currentClose;

    candleSeries.update({
        time: (candlestick.t / 1000) + 7200, 
        open: parseFloat(candlestick.o),
        high: parseFloat(candlestick.h),
        low: parseFloat(candlestick.l),
        close: currentClose
    });

	
}