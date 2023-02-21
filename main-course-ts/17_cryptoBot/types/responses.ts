export type ListCurrenciesResponse = {
    currencies: Array<string>;
}

export type AverageResponse = {
    symbol: string;
    name: string;
    market: string;
    average: number;
}
