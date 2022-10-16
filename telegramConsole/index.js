const { Command } = require('commander');
const TgBot = require('node-telegram-bot-api');
const fs = require('fs');

require('dotenv').config();

const program = new Command();
const bot = new TgBot(process.env.BOT_TOKEN, {polling: true});

program.command('message')
    .description('Send a message to telegram bot')
    .argument('<string>', 'message to send')
    .action((message) => {
        bot
            .sendMessage(process.env.CHAT_ID, message)
            .then(() => {
                process.exit(0);
            });
    });

program.command('photo')
    .description('Send a photo to telegram bot')
    .argument('<string>', 'path to photo')
    .action((photoPath) => {
        fs.readFile(photoPath, (e, imageBuffer) => {
            bot
                .sendPhoto(process.env.CHAT_ID, imageBuffer)
                .then(() => {
                    process.exit(0);
                })
        })
    });

program.parse();
