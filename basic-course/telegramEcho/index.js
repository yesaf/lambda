const TgBot = require('node-telegram-bot-api');
const axios = require('axios');

require('dotenv').config();

const bot = new TgBot(process.env.BOT_TOKEN, { polling: true });

bot.on('message', (msg) => {
    console.log(`User ${msg.from.username} sent message: ${msg.text}`);
    bot.sendMessage(msg.chat.id, 'You wrote: "' + msg.text + '"');
});

bot.onText(/photo/, (msg) => {
    axios.get('https://picsum.photos/200/300')
        .then(response => {
            bot.sendPhoto(msg.chat.id, response.request.res.responseUrl);
        });
});
