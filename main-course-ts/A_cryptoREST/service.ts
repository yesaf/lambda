import { askCoinbase, askCoinMarketCap, askCoinPaprika, askCoinStats, askKucoin } from './utils/apiRequests';
import db from '../database/mysql';
import { QueryError } from 'mysql2';

class CryptoService {
    constructor() {
        this.init();
    }

    async init() {
        db.connect();

        // update data every 5 minutes
        this.updateData();
        setInterval(() => this.updateData(), 5 * 60 * 1000);
    }

    getHistory(currencySymbol: string, market: string | undefined, date: string, callback: (err: QueryError | null, result: any) => {}) {
        let query = `
            select *
            from history
            where coin_symbol = '${currencySymbol}'
              and update_date <= '${date}'
        `;
        if (market) {
            query += ` and market = '${market}'`;
        }
        db.query(query, callback);
    }

    private async updateData() {
        const data = [];
        data.push(...await askCoinbase());
        data.push(...await askCoinMarketCap());
        data.push(...await askCoinStats());
        data.push(...await askKucoin());
        data.push(...await askCoinPaprika());

        const dateToDatetime = (date: string) => {
            return date.replace('T', ' ').replace('Z', '');
        };

        let query = 'insert into history (coin_name, coin_symbol, price, market, update_date) values ' +
            data.map(coin =>
                `('${coin.name}', '${coin.symbol}', ${coin.price}, '${coin.market}', '${dateToDatetime(coin.last_updated)}')`)
                .join(', ');

        db.query(query, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`${(new Date()).toLocaleString()}: Data updated`);
            }
        });
    }


}

export default CryptoService;
