const trace = {
    x: window.result.x,
    open: window.result.open,
    high: window.result.high,
    low: window.result.low,
    close: window.result.close,
    type: "ohlc",
    increasing: { line: { color: "#17BECF" } },
    decreasing: { line: { color: "#7F7F7F" } },
};

const layout = {
    title: "OHLC Chart",
    dragmode: "zoom",
    xaxis: {
        title: "Date",
        type: "date",
    },
    yaxis: {
        title: "Price",
        type: "linear",
    },
};

Plotly.newPlot("ohlc-result-div", [trace], layout);
