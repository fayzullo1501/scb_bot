const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const token = "7022916702:AAFsD8Hwh06P-TDlBuVBb7-zPQyMTZ8QL20"; // Замените на новый токен
const apiUrl = `https://api.telegram.org/bot${token}`;

const chatId = "446415034"; // Замените на действительный chat_id

app.post("/submit-form", async (req, res) => {
  const { name, phone, email, text } = req.body;

  const message = `
    Новая заявка от клиента:
    Имя: ${name}
    Телефон: ${phone}
    E-mail: ${email}
    Сообщение: ${text}
  `;

  try {
    const url = `${apiUrl}/sendMessage`;

    await axios.post(url, {
      chat_id: chatId,
      text: message,
    });

    res.status(200).send("Заявка отправлена в Telegram");
  } catch (error) {
    console.error(
      "Ошибка при отправке сообщения в Telegram:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Ошибка при отправке заявки");
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
