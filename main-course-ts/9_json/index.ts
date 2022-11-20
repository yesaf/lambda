import { Router } from 'express';
import JsonController from './controller';

const router: Router = Router();

router.get('/', (req, res) => {
    res.send('Make POST request to this link to store your json');
});
router.post('/', JsonController.store.bind(JsonController));
router.get('/:link', JsonController.get.bind(JsonController));

export default router;
