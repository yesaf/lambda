const axios = require('axios');
const fs = require('fs');

const currToNum = (curr) => {
    switch (curr) {
        case 'USD':
            return 840;
        case 'EUR':
            return 978;
        default:
            return 0;
    }
}

const currency = (bot, mainKeyboard = null) => {
    bot.onText(/(\/rates|Currency rates)/, (msg) => {
        const options = {
            reply_markup: JSON.stringify({
                keyboard: [
                    [{ text: 'USD' }, { text: 'EUR' }],
                    [{ text: 'To main menu' }],
                ],
            }),
        };


        bot.sendMessage(msg.chat.id, "Choose currency", options);

        bot.onText(/(USD|EUR)/, (currencyMsg) => {
            // PrivatBank API
            // axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5').then(res => {
            //
            //     const ratesData = res.data.find(curr => curr.ccy === currencyMsg.text);
            //
            //
            //     bot.sendMessage(msg.chat.id,
            //         `${currencyMsg.text} to UAH\nBUY: ${ratesData.buy}\nSALE: ${ratesData.sale}`,
            //         {
            //         reply_markup: JSON.stringify(mainKeyboard ? mainKeyboard : {
            //             hide_keyboard: true
            //         }),
            //     });
            // });

            // Monobank API
            axios.get('https://api.monobank.ua/bank/currency').then(res => {

                // Save res to db.json
                fs.writeFile('db.json', JSON.stringify(res.data), (err) => {
                    if (!err) {
                        console.log('Rates saved');
                    }
                })

                const ratesData = res.data.find(curr => curr.currencyCodeA === currToNum(currencyMsg.text));

                console.log(ratesData);
                bot.sendMessage(msg.chat.id,
                    `${currencyMsg.text} to UAH\nBUY: ${ratesData.rateBuy}\nSALE: ${ratesData.rateSell}`,
                    {
                    reply_markup: JSON.stringify(mainKeyboard ? mainKeyboard : {
                        hide_keyboard: true
                    }),
                });
            }).catch(err => {
                // If 429 code, get data from db.json
                if (err.response.status === 429) {
                    fs.readFile('db.json', (readErr, data) => {
                        if (!readErr) {
                            const ratesData = JSON.parse(data)
                                .find(curr => curr.currencyCodeA === currToNum(currencyMsg.text));
                            console.log(ratesData);
                            bot.sendMessage(msg.chat.id,
                                `${currencyMsg.text} to UAH\nBUY: ${ratesData.rateBuy}\nSALE: ${ratesData.rateSell}`,
                                {
                                    reply_markup: JSON.stringify(mainKeyboard ? mainKeyboard : {
                                        hide_keyboard: true
                                    }),
                                });
                        }
                    })
                } else {
                    console.log(err);
                }
            });



            bot.removeTextListener(/(USD|EUR)/);
        });

    });
};

module.exports = currency;
