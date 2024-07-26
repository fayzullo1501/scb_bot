// 446415034  6498144305  7022916702:AAFsD8Hwh06P-TDlBuVBb7-zPQyMTZ8QL20

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Добавление заголовков CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

const token = '7022916702:AAFsD8Hwh06P-TDlBuVBb7-zPQyMTZ8QL20'; // Установите здесь ваш токен
const apiUrl = `https://api.telegram.org/bot${token}`;

const chatIds = ['446415034', '6498144305']; // Обновите здесь ваши chat ID

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

    console.log('Отправка сообщения в Telegram:', message);

    // Отправляем сообщение в каждый указанный chat ID
    for (const chatId of chatIds) {
      const response = await axios.post(url, {
        chat_id: chatId,
        text: message,
      });
      console.log(`Сообщение успешно отправлено в чат ${chatId}:`, response.data);
    }

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
