export type Coin = {
    name: string;
    symbol: string;
    price: number;
    market: string;
    last_updated: string;
}

export type CoinMarketCapType = {
    id: number;
    name: string;
    symbol: string;
    last_updated: string;
    quote: {
        USD: {
            price: number;
        }
    }
}

export type CoinBaseType = {
    rates: {
        [key: string]: number;
    }
}

export type CoinStatsType = {
    id: string;
    name: string;
    symbol: string;
    price: number;
    last_updated: string;
}

export type CoinPaprikaType = {
    id: string;
    name: string;
    symbol: string;
    last_updated: string;
    quotes: {
        USD: {
            price: number;
        }
    }
};
