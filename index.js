process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { Telegraf } = require('telegraf');

const app = express();
const bot = new Telegraf('7022916702:AAFsD8Hwh06P-TDlBuVBb7-zPQyMTZ8QL20');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Настройка вебхука
app.post('/submit', (req, res) => {
    const { name, phone, email, text } = req.body;

    const message = `
        Новая заявка:
        Имя: ${name}
        Телефон: ${phone}
        Email: ${email}
        Сообщение: ${text}
    `;

    bot.telegram.sendMessage('446415034', message)
        .then(() => {
            res.send('Заявка отправлена');
        })
        .catch(err => {
            console.error('Ошибка отправки сообщения:', err);
            res.status(500).send('Ошибка отправки заявки');
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

bot.launch();
