const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const token = process.env.TOKEN; // Используем переменную окружения для токена
const apiUrl = `https://api.telegram.org/bot${token}`;

const chatId = process.env.CHAT_ID; // Используем переменную окружения для chat_id

let requestCounter = 0; // Переменная-счетчик для отслеживания количества заявок

app.post("/submit-form", async (req, res) => {
  const { name, phone, email, company, text } = req.body;

  requestCounter++; // Увеличиваем счетчик при каждой новой заявке

  const message = `
    Новая заявка № ${requestCounter}:
    Имя: ${name}
    Телефон: ${phone}
    E-mail: ${email}
    Компания: ${company}
    Сообщение: ${text}
  `;

  try {
    const url = `${apiUrl}/sendMessage`;

    await axios.post(url, {
      chat_id: chatId,
      text: message,
    });

    res.status(200).send("Заявка успешно отправлена");
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
