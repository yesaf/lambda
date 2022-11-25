import { Router } from 'express';
import CryptoController from './controller';

const router: Router = Router();

router.get('/average', CryptoController.getHistory.bind(CryptoController));
router.get('/listCurrencies', CryptoController.getCurrencies.bind(CryptoController));

export default router;
