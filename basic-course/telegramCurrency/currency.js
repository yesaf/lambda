const axios = require('axios');

const currency = (bot, mainKeyboard = null) => {
    bot.onText(/(\/rates|Currency rates)/, (msg) => {
        const options = {
            reply_markup: JSON.stringify({
                keyboard: [
                    [{ text: 'USD' }],
                    [{ text: 'EUR' }],
                    [{ text: 'To main menu' }],
                ],
            }),
        };


        bot.sendMessage(msg.chat.id, "Choose currency", options);

        bot.onText(/(USD|EUR)/, (currencyMsg) => {
            axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5').then(res => {

                const ratesData = res.data.find(curr => curr.ccy === currencyMsg.text);


                bot.sendMessage(msg.chat.id,
                    `EUR to UAH\nBUY: ${ratesData.buy}\nSALE: ${ratesData.sale}`,
                    {
                    reply_markup: JSON.stringify(mainKeyboard ? mainKeyboard : {
                        hide_keyboard: true
                    }),
                });
            });


            bot.removeTextListener(/(USD|EUR)/);
        });

    });
};

module.exports = currency;
