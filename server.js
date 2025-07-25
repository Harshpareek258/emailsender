require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const upload = multer();
app.use(cors());
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

app.post('/send', upload.single('media'), (req, res) => {
  try {
    const { email, message } = req.body;
    const mediaFile = req.file;

    if (!email || !message) {
      return res.status(400).send('❗ Email and message required');
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: '📤 Message from Camera App',
      text: message
    };

    if (mediaFile && mediaFile.buffer) {
      mailOptions.attachments = [{
        filename: mediaFile.originalname || 'media',
        content: mediaFile.buffer
      }];
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Error:", err);
        return res.status(500).send("❌ Email failed.");
      }
      res.send("✅ Email sent!");
    });
  } catch (err) {
    console.error("🔥 Server Error:", err);
    res.status(500).send("⚠️ Internal error.");
  }
});

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
