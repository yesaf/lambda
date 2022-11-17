import { Request, Response } from 'express';
import * as fs from 'fs';
import ipToLocation from './utils/ipToLocation';


class GeolocationController {
    async convert(req: Request, res: Response) {
        const { ip } = req.body;

        const data = fs.readFileSync('./4_geolocation/samples/IP2LOCATION-LITE-DB1.CSV')
            .toString().split('\n')
            .map((row) => {
                return row
                    .split(',')
                    .map(s => {
                        return s.replace(/"/g, '');
                    });
            });

        const index = ipToLocation(data, ip);

        res.send({
            ip: ip,
            countryCode: data[index][2],
            country: data[index][3].replace('\r', ''),
        });
    }
}

export default new GeolocationController();
