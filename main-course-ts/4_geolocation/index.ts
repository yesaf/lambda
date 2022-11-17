import { Router } from 'express';
import GeolocationController from './controller';

const router: Router = Router();

router.post('/ipToLocation', GeolocationController.convert);

export default router;

