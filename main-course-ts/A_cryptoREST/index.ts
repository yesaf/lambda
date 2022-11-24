import { Router } from 'express';
import CryptoController from './controller';

const router: Router = Router();

router.get('/', CryptoController.getHistory.bind(CryptoController));
router.get('/currencies', CryptoController.getCurrencies.bind(CryptoController));

export default router;
