const TgBot = require('node-telegram-bot-api');

const forecast = require('./forecast');
const currency = require('./currency');

require('dotenv').config();

const mainKeyboard = {
    keyboard: [
        [{ text: 'Forecast' }],
        [{ text: 'Currency rates' }],
    ]
};

const bot = new TgBot(process.env.BOT_TOKEN, {polling: true});


bot.setMyCommands([
    { command: 'start', description: 'Start bot' },
    { command: 'forecast', description: 'Get forecast' },
    { command: 'rates', description: 'Get currency rates to UAH' },
]);

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `Hello! My name is Gustavo, but you can call me Gus. What you want me to discover for you?`,
        {
        reply_markup: JSON.stringify(mainKeyboard)
        });
});

bot.onText(/To main menu/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        'Choose the option',
        {
            reply_markup: JSON.stringify(mainKeyboard)
        });
});


forecast(bot, mainKeyboard);
currency(bot, mainKeyboard);
