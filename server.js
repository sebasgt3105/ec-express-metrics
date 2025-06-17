const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());

const SHEET_ID = '1lNzDJqQV7CvnihJa1u0SQ81ASI1vNE36HM0pzQgFujA';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

app.get('/ventas', async (req, res) => {
  try {
    const r = await fetch(SHEET_URL);
    const text = await r.text();
    const jsonText = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s)[1];
    const json = JSON.parse(jsonText);
    const rows = json.table.rows.map(r => ({
      producto: r.c[0]?.v || '',
      fecha: r.c[1]?.v || '',
      stock: parseInt(r.c[2]?.v) || 0,
      ventas: parseInt(r.c[3]?.v) || 0,
      precio: parseFloat(r.c[4]?.v) || 0,
    }));
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Servidor listo en puerto ${port}`));
