import db from '../database/mysql';
import { QueryError } from 'mysql2';

class TgService {

    getUser(userId: number, callback: (err: QueryError | null, result: any) => void) {
        const query = `select *
                       from tgusers
                       where user_id = ${userId}`;
        db.query(query, callback);
    }

    addUser(userId: number, callback: (err: QueryError | null, result: any) => void) {
        const query = `insert ignore into tgusers (user_id)
                       values (${userId})`;
        db.query(query, callback);
    }

    addUserFollowing(userId: number, coinSymbols: Array<string>, callback: (err: QueryError | null, result: any) => void) {
        const query = `insert into following (user_id, currency_symbol)` +
            `values ${coinSymbols.map((symbol) => `(${userId}, '${symbol}')`).join(', ')}`;

        db.query(query, callback);
    }

    deleteUserFollowing(userId: number, coinSymbol: string, callback: (err: QueryError | null, result: any) => void) {
        const query = `delete
                       from following
                       where user_id = ${userId}
                         and currency_symbol = '${coinSymbol}'`;
        db.query(query, callback);
    }

    getUserFollowing(userId: number, callback: (err: QueryError | null, result: any) => void) {
        const query = `select *
                       from following
                       where user_id = ${userId}`;
        db.query(query, callback);
    }

    addUserFavorite(userId: number, coinSymbol: string, callback: (err: QueryError | null, result: any) => void) {
        const query = `insert into favorite (user_id, currency_symbol)
                       values (${userId}, '${coinSymbol}')`;
        db.query(query, callback);
    }

    deleteUserFavorite(userId: number, coinSymbol: string, callback: (err: QueryError | null, result: any) => void) {
        const query = `delete
                       from favorite
                       where user_id = ${userId}
                         and currency_symbol = '${coinSymbol}'`;
        db.query(query, callback);
    }

    getUserFavorites(userId: number, callback: (err: QueryError | null, result: any) => void) {
        const query = `select *
                       from favorite
                       where user_id = ${userId}`;
        db.query(query, callback);
    }
}

export default TgService;
