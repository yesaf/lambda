import { Request, Response } from 'express';
import { connectToDatabase } from '../database';
import * as mongodb from 'mongodb';

class JsonController {

    jsonCollection: mongodb.Collection | undefined = undefined;

    constructor() {
        this.init();
    }

    async init() {
        this.jsonCollection = await connectToDatabase('jsonStorage', 'json');
    }

    async checkIfLinkExists(link: string) {
        if (!this.jsonCollection) {
            return false;
        }

        let result = await this.jsonCollection.findOne({ link: link });

        return !!result;
    }

    checkIfCanBeId(link: string) {
        return link.match(/^[0-9a-fA-F]{24}$/);
    }

    async store(req: Request, res: Response) {
        if (!this.jsonCollection) {
            return res.status(500).send('Database not initialized');
        }

        const { link, data } = req.body;

        if (this.checkIfCanBeId(link)) {
            return res.status(400).send({
                message: 'Link may be an id of an object',
            });
        }

        if (await this.checkIfLinkExists(link)) {
            return res.status(400).send({
                message: 'Link already exists',
            });
        }

        let result: any = null;
        if (data) {
            if (link) {
                result = await this.jsonCollection.insertOne({ link, data });
            } else {
                result = await this.jsonCollection.insertOne({ data });
            }
        }

        if (!result) {
            return res.status(400).send({
                message: 'Please provide data to store',
            });
        }

        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        let accessLinks = [fullUrl + result.insertedId];
        if (link) {
            accessLinks.push(fullUrl + link);
        }

        res.status(200).send({
            message: 'Data stored with id: ' + result.insertedId,
            accessLinks: accessLinks,
        });
    }

    async get(req: Request, res: Response) {
        if (!this.jsonCollection) {
            return res.status(500).send('Database not initialized');
        }

        const { link } = req.params;
        let result = await this.jsonCollection.findOne({
            $or: [
                { link: link },
                { _id: this.checkIfCanBeId(link) ? new mongodb.ObjectId(link) : null },
            ],
        });

        if (!result) {
            return res.status(404).send({
                message: 'Data not found',
            });
        }

        res.status(200).send(result.data);
    }
}

export default new JsonController();
