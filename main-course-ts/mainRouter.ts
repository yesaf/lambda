import { Application } from 'express';
import TaskRouter from './A_cryptoREST';
import runBot from './B_cryptoBot';

runBot();

class AppRouter {
    constructor(private app: Application) {
    }

    init() {
        this.app.get('/', (_req, res) => {
            res.send('API Running');
        });
        this.app.use('/api', TaskRouter);
    }
}

export default AppRouter;
