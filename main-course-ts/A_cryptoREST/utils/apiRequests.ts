import axios from 'axios';
import { Coin, CoinMarketCapType, CoinPaprikaType, CoinStatsType } from 'Coins';

require('dotenv').config();

const tokens = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'LTC': 'Litecoin',
    'USDT': 'Tether',
    'XMR': 'Monero',
};

export function mapSymbolToName (symbol: string) {
    // @ts-expect-error - we know that symbol is a key of tokens
    return tokens[symbol];
}

export async function askCoinMarketCap() {
    const res = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY,
        },
    })
        .then((res) => res.data.data)
        .then((data) => data.map((coin: CoinMarketCapType) => {
            return {
                name: coin.name,
                symbol: coin.symbol,
                price: coin.quote.USD.price,
                market: 'CoinMarketCap',
                last_updated: coin.last_updated,
            };
        }));
    //@ts-expect-error - Here comes TS7053 error, but it's not a problem
    return res.filter((coin: Coin) => tokens[coin.symbol]);
}

export async function askCoinbase() {
    const data = Promise.allSettled(
        Object.keys(tokens)
            .map((token) =>
                axios.get(`https://api.coinbase.com/v2/prices/${token}-USD/spot`)))
        .then((res) => res
            .filter((item) => item.status === 'fulfilled')
            .map((item) => {
                //@ts-ignore
                const { base, amount } = item.value.data.data;
                return {
                    //@ts-expect-error - Here comes TS7053 error, but it's not a problem
                    name: tokens[base],
                    symbol: base,
                    price: amount,
                    market: 'Coinbase',
                    last_updated: new Date().toISOString(),
                };
            }));
    return data;
}

export async function askCoinStats() {
    const res = await axios.get('https://api.coinstats.app/public/v1/coins?skip=0&limit=0&currency=USD')
        .then((res) => res.data.coins)
        .then((res) => {
            return res.map((coin: CoinStatsType) => {
                return {
                    name: coin.name,
                    symbol: coin.symbol,
                    price: coin.price,
                    market: 'CoinStats',
                    last_updated: new Date().toISOString(),
                };
            });
        })
        .then((res) => res.filter((coin: Coin) => Object.keys(tokens).includes(coin.symbol)));
    return res;
}

export async function askKucoin() {
    const res = await axios.get(`https://api.kucoin.com/api/v1/prices?currencies=${Object.keys(tokens).join(',')}&base=USD`)
        .then((res) => res.data.data)
        .then((data) => {
            let res = [];
            for (const coin in data) {
                res.push({
                    // @ts-ignore
                    name: tokens[coin],
                    symbol: coin,
                    price: data[coin],
                    market: 'Kucoin',
                    last_updated: new Date().toISOString(),
                });
            }
            return res;
        });

    return res;
}

export async function askCoinPaprika() {
    const res = await axios.get('https://api.coinpaprika.com/v1/tickers')
        .then((res) => res.data);


    return res.map((coin: CoinPaprikaType) => {
        return {
            name: coin.name,
            symbol: coin.symbol,
            price: coin.quotes.USD.price,
            market: 'CoinPaprika',
            last_updated: coin.last_updated,
        };
    })
        .filter((coin: Coin) => Object.keys(tokens).includes(coin.symbol));
}
