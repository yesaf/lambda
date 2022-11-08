const TgBot = require('node-telegram-bot-api');
const axios = require('axios');

require('dotenv').config();

const API_KEY = process.env.API_KEY;
const bot = new TgBot(process.env.BOT_TOKEN, {polling: true});

const citiesCoords = {
    Kyiv: { lat: 50.45, lon: 30.542 },
    Lviv: { lat: 49.843, lon: 24.0311 },
    Dnipro: { lat: 48.45, lon: 34.9833 },
};

function fromKelvin(tempKelvin) {
    return Math.round(tempKelvin - 273.15);
}


function getWeather(city, skipEven) {
    const link = 'https://api.openweathermap.org/data/2.5/forecast'
    const params = {
        lat: citiesCoords[city].lat,
        lon: citiesCoords[city].lon,
        appid: API_KEY,
    };
    return axios
        .get(link, {params: params})
        .then(res => {
            let result = `<strong>Forecast for ${city}</strong>\n\n`;
            let weathers = {};
            res.data.list.forEach(w => {
                const [ date, time ] = w.dt_txt.split(' ');
                const weatherObj = {
                    time: time.substr(0, 5),
                    temp: fromKelvin(w.main.temp_min),
                    feelsLike: fromKelvin(w.main.feels_like),
                    weather: w.weather[0].main.toLowerCase()
                }
                if (weathers[date]) {
                    weathers[date].push(weatherObj);
                } else {
                    weathers[date] = [weatherObj];
                }
            });
            Object.keys(weathers).forEach(date => {
                result += prettifyDate(date) + '\n';
                weathers[date].forEach((weatherData, index) => {
                    if (index % 2 === 0 || !skipEven) {
                        result += `    ${weatherData.time}, ` + '\t' +
                            `${weatherData.temp} C°, ` + '\t' +
                            `feels like ${weatherData.feelsLike} C°, ` + '\t' +
                            `${weatherData.weather}` + '\n';
                    }
                })
            })
            return result;
        });
}

function prettifyDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('en-us', {  weekday: 'long' }) + ', ' +
            date.toLocaleString('en-us', {  month: 'long' }) + ' ' +
            date.getDate() + ':';
}

bot.setMyCommands([
    { command: 'start', description: 'Start bot' },
    { command: 'forecast', description: 'Get forecast' }
    ]);

bot.onText(/\/start/, function onPhotoText(msg) {
    bot.sendMessage(msg.chat.id, `Hello! My name is Gustavo, but you can call me Gus.`)
});

bot.onText(/\/forecast/, (msg) => {
    const cities = Object.keys(citiesCoords).map(city => {
        return [{
            text: city,
        }];
    });

    const options = {
        reply_markup: JSON.stringify({
            keyboard: cities
        })
    };

    bot.sendMessage(msg.chat.id, "Choose city", options);

    const cityRegex = new RegExp(`^${Object.keys(citiesCoords).join('|')}$`);
    bot.onText(cityRegex, (cityMsg) => {
        bot.sendMessage(msg.chat.id, 'Choose interval', {
            reply_markup: JSON.stringify({
                keyboard: [
                    [{ text: 'every 3 hours' }],
                    [{ text: 'every 6 hours' }],
                ]
            })
        });
        bot.onText(/^every 3|6 hours$/, (intervalMsg) => {
            const skipEven = intervalMsg.text === 'every 6 hours';
            getWeather(cityMsg.text, skipEven).then((res) => {
                bot.sendMessage(msg.chat.id, res, {
                    reply_markup: JSON.stringify({
                        hide_keyboard: true
                    }),
                    parse_mode: 'HTML'
                });
            });
            bot.removeTextListener(/^every 3|6 hours$/);
        });
        bot.removeTextListener(cityRegex);
    });

});
