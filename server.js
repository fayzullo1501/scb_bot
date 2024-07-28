const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000; // Railway использует переменную окружения PORT

app.use(cors()); // Добавляем эту строку для разрешения CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const token = "7022916702:AAFsD8Hwh06P-TDlBuVBb7-zPQyMTZ8QL20"; // Укажите здесь ваш токен
const apiUrl = `https://api.telegram.org/bot${token}`;

const chatIds = ["446415034", "6498144305"]; // Укажите здесь ваши chat_id

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

    // Отправляем сообщение в каждый чат
    await Promise.all(
      chatIds.map(chatId =>
        axios.post(url, {
          chat_id: chatId,
          text: message,
        })
      )
    );

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
