import { Request, Response } from 'express';
import CryptoService from './service';
import { Coin } from './types/coins';
import { tokens, mapSymbolToName } from './utils/apiRequests';

class CryptoController {

    service: CryptoService = new CryptoService();

    getHistory(req: Request, res: Response) {
        let { currencySymbol, market, date } = req.query;
        if (!currencySymbol || typeof currencySymbol !== 'string') {
            return res.status(400).send('Currency symbol is required and must be a string');
        }

        if (!market || typeof market !== 'string') {
            market = undefined;
        }

        if (!date || typeof date !== 'string') {
            return res.status(400).send('Date is required and must be a string');
        }

        this.service.getHistory(currencySymbol, market, date, (err, result) => {
            if (err) {
                res.status(500).send({
                    message: err.message || 'Some error occurred while retrieving history.',
                });
            } else {
                const average = result.reduce((acc: number, curr: Coin) => acc + curr.price, 0) / result.length;
                res.status(200).send({
                    symbol: currencySymbol,
                    // @ts-ignore
                    name: mapSymbolToName(currencySymbol),
                    market: market || 'all',
                    average,
                });
            }
            return {}
        });
    }

    getCurrencies(req: Request, res: Response) {
        res.send({
            currencies: [...Object.keys(tokens)],
        });
    }
}

export default new CryptoController();
