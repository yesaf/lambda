import { Application } from 'express';
import TaskRouter from './C_shortLinker';

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
