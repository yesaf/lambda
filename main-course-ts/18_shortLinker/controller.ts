import { Request, Response } from 'express';
import { connectToCollection } from '../database/mongodb';
import { Collection, ObjectId } from 'mongodb';

class ShortLinkerController {
    linksCollection: Collection | undefined = undefined;

    constructor() {
        this.init();
    }

    async init() {
        this.linksCollection = await connectToCollection('shortLinker', 'links');
    }

    async shorten(req: Request, res: Response) {
        const { url } = req.body;

        if (!this.linksCollection) {
            res.status(503).send('Database not connected');
            return;
        }
        if (!url) {
            res.status(400).send('No URL provided');
            return;
        }

        const result = await this.linksCollection.insertOne({ url });

        const link = req.protocol + '://' + req.get('host') + '/api/' + result.insertedId;

        res.status(200).send({
            shortened: link,
        });
    }

    async redirect(req: Request, res: Response) {
        console.log(req.params.id.length);
        const { id } = req.params;

        if (!this.linksCollection) {
            res.status(503).send('Database not connected');
            return;
        }

        const result = await this.linksCollection.findOne({
            _id: new ObjectId(id),
        });

        if (!result) {
            res.status(404).send('Link not found');
            return;
        }

        let url = result.url;

        if (!url.match(/^https?:\/\//)) {
            url = 'https://' + url;
        }

        res.writeHead(301, {
            Location: url,
        }).end();
    }

    notLink(req: Request, res: Response) {
        res.status(404).send('Invalid link');
    }
}

export default new ShortLinkerController();
