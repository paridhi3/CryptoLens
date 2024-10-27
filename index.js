import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs"); // Set EJS as the view engine

const base_url = "https://api.coingecko.com/api/v3";

app.get("/", (req, res) => {
  res.render("index", { result: null, error: null });
});

app.get("/fetch-price", async (req, res) => {
  const { ids, currencies } = req.query;

  if (!ids || !currencies) {
    return res
      .status(400)
      .json({ error: "Please provide id(s), currency(s)." });
  }

  try {
    const result = await axios.get(`${base_url}/simple/price`, {
      params: {
        ids: ids,
        vs_currencies: currencies,
      },
    });

    console.log(result.data);
    res.render("index.ejs", { result: result.data });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message.data);
  }
});

app.get("/ohlc", async (req, res) => {
  const { id, currency, days } = req.query;

  if (!id || !currency || !days) {
    return res
      .status(400)
      .json({ error: "Please provide id, currency, and days parameters." });
  }

  try {
    const ohlc_result = await axios.get(`${base_url}/coins/${id}/ohlc`, {
      params: {
        vs_currency: currency,
        days: days,
      },
    });

    let day = [];
    let open = [];
    let high = [];
    let low = [];
    let close = [];

    for (let i = 0; i < ohlc_result.data.length; i++) {
      const unix_timestamp = ohlc_result.data[i][0];
      const date = new Date(unix_timestamp);
      const formattedDate = date.toISOString().split('T')[0];

      if (!day.includes(formattedDate)) {
        day.push(formattedDate);
        open.push(ohlc_result.data[i][1]);
        high.push(ohlc_result.data[i][2]);
        low.push(ohlc_result.data[i][3]);
        close.push(ohlc_result.data[i][4]);
      }
    }

    // Create the OHLC trace
    const result = {
      x: day,
      open: open,
      high: high,
      low: low,
      close: close,
      type: "ohlc",
      increasing: { line: { color: "#17BECF" } },
      decreasing: { line: { color: "#7F7F7F" } },
    };

    console.log("OHLC Result:", ohlc_result.data);
    console.log("Formatted Result:", result);
    res.render("chart.ejs", { result: result });

  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
