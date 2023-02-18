import { Router } from 'express';
import ShortLinkerController from './controller';

const router: Router = Router();

router.post('/shorten', ShortLinkerController.shorten.bind(ShortLinkerController));
router.get('/:id([0-9a-fA-F]{24})', ShortLinkerController.redirect.bind(ShortLinkerController));
router.get('/:id', ShortLinkerController.notLink);


export default router;
