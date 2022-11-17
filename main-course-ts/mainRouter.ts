import { Application } from 'express';
import GeolocationRouter from './4_geolocation';

class AppRouter {
    constructor(private app: Application) {
    }

    init() {
        this.app.get('/', (_req, res) => {
            res.send('API Running');
        });
        this.app.use('/api', GeolocationRouter);
    }
}

export default AppRouter;
