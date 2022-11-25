// @ts-ignore
import TgBot, { CallbackQuery, InlineKeyboardButton } from 'node-telegram-bot-api';
import axios, { AxiosResponse } from 'axios';
import TgService from './service';
import { AverageResponse, ListCurrenciesResponse } from 'ResponseTypes';
import { Favorite, Following } from 'TgDbTypes';

require('dotenv').config();

const apiLink = 'http://localhost:5000/api';

function addUserIfNotExist(service: TgService, userId: number, whenExists: () => void) {
    service.getUser(userId, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        if (result.length === 0) {
            service.addUser(userId, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                whenExists();
            });
        } else {
            whenExists();
        }
    });
}

function updateFollowingsToDefault(service: TgService, userId: number) {
    service.getUserFollowing(userId, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        const previousFollowings = result.map((row: Following) => row.currency_symbol);
        axios.get(apiLink + '/listCurrencies')
            .then((res: AxiosResponse<ListCurrenciesResponse>) => {
                const defaultFollowings = res.data.currencies;
                const followingsToAdd = defaultFollowings
                    .filter((symbol) => !previousFollowings.includes(symbol));
                if (followingsToAdd.length > 0) {
                    service.addUserFollowing(userId, followingsToAdd, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
    });
}

function addToFollowing(service: TgService, userId: number, coinSymbol: string, onAdded: () => void) {
    service.getUserFollowing(userId, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        const previousFavorite = result.map((row: Favorite) => row.currency_symbol);
        if (!previousFavorite.includes(coinSymbol)) {
            service.addUserFollowing(userId, [coinSymbol], (err) => {
                if (err) {
                    console.log(err);
                }
            });
            onAdded();
        }
    });
}

function addToFavorite(service: TgService, userId: number, coinSymbol: string, onAdded: () => void) {
    service.getUserFavorites(userId, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        const previousFavorite = result.map((row: Favorite) => row.currency_symbol);
        if (!previousFavorite.includes(coinSymbol)) {
            service.addUserFavorite(userId, coinSymbol, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            onAdded();
        }
    });
}

function getAverage(coinSymbol: string, date: Date) {
    return axios.get(apiLink + '/average', {
        params: {
            currencySymbol: coinSymbol,
            date: date.toISOString().split('T')[0]
        }
    });
}

function runBot() {
    const bot = new TgBot(process.env.BOT_TOKEN || '', { polling: true });
    const service = new TgService();

    bot.setMyCommands([
        { command: 'start', description: 'Say hello and update your followings to default' },
        { command: 'help', description: 'Short info and commands' },
        { command: 'list_recent', description: 'Get recent rates for available currencies' },
        { command: 'add_to_favorite', description: 'Add currency to favorite' },
        { command: 'list_favorite', description: 'Get recent rates for your favorite currencies' },
        { command: 'delete_favorite', description: 'Deletes currency from favorite' },
    ]);

    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, `Hello, ${msg.from!.first_name}!`);
        addUserIfNotExist(service, msg.from!.id, () => updateFollowingsToDefault(service, msg.from!.id));

    });

    bot.onText(/\/help/, (msg) => {
        bot.getMyCommands().then((data) => {
            let text = 'Available commands:';
            data.forEach((command) => {
                text += `
/${command.command} - ${command.description}`;
            });
            bot.sendMessage(msg.chat.id, text);
        });
    });

    bot.onText(/\/list_recent/, (msg) => {
        service.getUserFollowing(msg.from!.id, (err, result) => {
            let message = 'Recent rates for your followings:';
            let promises: Array<Promise<any>> = [];

            result.forEach((row: Following) => {
                const date = new Date();
                date.setMinutes(date.getMinutes() - 15);
                promises.push(getAverage(row.currency_symbol, date));
            });

            Promise.all(promises).then((res) => {
                res.forEach((response: AxiosResponse<AverageResponse>) => {
                    message += `
/${response.data.symbol} $${response.data.average}`;
                });
                bot.sendMessage(msg.chat.id, message);
            });
        });
    });

    bot.onText(/\/add_to_favorite/g, (msg) => {
        if (msg.text!.split(' ').length === 1) {
            bot.sendMessage(msg.chat.id, 'Please, specify currency symbol');
            return;
        }
        console.log(`Adding to user ${msg.from!.id} favorites ${msg.text!.split(' ')[1]}`);

        addToFavorite(service, msg.from!.id, msg.text!.split(' ')[1], () => {
            bot.sendMessage(msg.chat.id, `Added to favorite`);
        });
    });

    bot.onText(/\/list_favorite/, (msg) => {
        service.getUserFavorites(msg.from!.id, (err, result) => {
            let message = 'Recent rates for your favorites:';
            let promises: Array<Promise<any>> = [];

            result.forEach((row: Favorite) => {
                const date = new Date();
                date.setMinutes(date.getMinutes() - 15);
                promises.push(getAverage(row.currency_symbol, date));
            });

            Promise.all(promises).then((res) => {
                res.forEach((response: AxiosResponse<AverageResponse>) => {
                    message += `
/${response.data.symbol} $${response.data.average}`;
                });
                bot.sendMessage(msg.chat.id, message);
            });
        });
    });

    bot.onText(/\/delete_favorite/, (msg) => {
        if (msg.text!.split(' ').length === 1) {
            bot.sendMessage(msg.chat.id, 'Please, specify currency symbol');
            return;
        }

        service.deleteUserFavorite(msg.from!.id, msg.text!.split(' ')[1], (err) => {
            if (err) {
                console.log(err);
                return;
            }

            bot.sendMessage(msg.chat.id, `Deleted from favorite`);
        });
    });

    bot.onText(/\/[A-Z]{3,5}/, (msg) => {
        const symbol = msg.text!.split('/')[1];
        const limitDates = {
            '30 minutes': new Date(),
            '1 hour': new Date(),
            '3 hours': new Date(),
            '6 hours': new Date(),
            '12 hours': new Date(),
            '24 hours': new Date(),
        };

        let interval = 30;
        let key: keyof typeof limitDates;
        for (key in limitDates) {
            limitDates[key].setMinutes(limitDates[key].getMinutes() - interval);
            interval *= 2;
        }

        let promises: Array<Promise<any>> = [];
        for (key in limitDates) {
            promises.push(getAverage(symbol, limitDates[key]));
        }
        Promise.all(promises).then((res) => {
            let message = `Rates for ${symbol} for last:`;
            res.forEach((response: AxiosResponse<AverageResponse>, index) => {
                message += `
${Object.keys(limitDates)[index]} - ${Math.round(response.data.average * 1000) / 1000}`;
            });
            service.getUserFollowing(msg.from!.id, (err, result) => {
                const following = result.find((row: Following) => row.currency_symbol === symbol);
                let keyboard: InlineKeyboardButton[][];
                if (following) {
                    keyboard = [
                        [{ text: 'Delete from followings', callback_data: `delete_from_followings ${symbol}` }],
                    ];
                } else {
                    keyboard = [
                        [{ text: 'Add to followings', callback_data: `add_to_followings ${symbol}` }],
                    ];
                }

                bot.sendMessage(msg.chat.id, message, {
                    reply_markup: {
                        inline_keyboard: keyboard,
                    }
                });

            })
        });
    });

    bot.on('callback_query', (callbackQuery) => {
        if (callbackQuery.data!.split(' ')[0] === 'add_to_followings') {
            addToFollowing(service,
                callbackQuery.from!.id,
                callbackQuery.data!.split(' ')[1],
                () => {
                    bot.sendMessage(callbackQuery.message!.chat.id, 'Added to followings');
                });
        } else if (callbackQuery.data!.split(' ')[0] === 'delete_from_followings') {
            service.deleteUserFollowing(callbackQuery.from!.id,
                callbackQuery.data!.split(' ')[1],
                (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    bot.sendMessage(callbackQuery.message!.chat.id, 'Deleted from followings');
                });
        }
    });
}

export default runBot;
