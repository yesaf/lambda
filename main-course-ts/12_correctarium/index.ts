import { Router } from 'express';
import GeolocationController from './controller';

const router: Router = Router();

router.post('/order', GeolocationController.order);

export default router;

