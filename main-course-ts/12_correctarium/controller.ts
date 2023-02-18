import { Request, Response } from 'express';
import { calculateDate, calculatePrice, calculateTime } from './utils/calculations';

class CorrectariumController {
    async order(req: Request, res: Response) {
        const { language, mimetype, count } = req.body;

        const requiredTime = calculateTime(language, mimetype, count);

        console.log(requiredTime);

        const deadline = calculateDate(new Date(), requiredTime);

        res.send({
            price: calculatePrice(language, mimetype, count),
            time: Math.round(requiredTime/3600)/1000,
            deadline: deadline.getTime(),
            deadline_date: deadline.toLocaleString(),
        });
    }
}

export default new CorrectariumController();
