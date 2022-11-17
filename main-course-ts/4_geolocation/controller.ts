import { Request, Response } from 'express';
import * as fs from 'fs';

function binarySearch(arr: Array<Array<string>>, l: number, r: number, x: number): number{
    if (r >= l) {
        let mid = l + Math.floor((r - l) / 2);

        if (x >= Number(arr[mid][0]) && x <= Number(arr[mid][1]))
            return mid;

        if (Number(arr[mid][0]) > x)
            return binarySearch(arr, l, mid - 1, x);

        return binarySearch(arr, mid + 1, r, x);
    }

    return -1;
}

function ipToDecimal(ip: string): number {
    let ipArr = ip.split('.');
    let result = 0;
    for (let i = 0; i < 4; i++) {
        result += Number(ipArr[i]) * Math.pow(256, 3 - i);
    }
    return result;
}

class GeolocationController {

    private static ipToLocation(data: Array<Array<string>>, ip: string): number {
        return binarySearch(
            data,
            1,
            data.length - 2,
            ipToDecimal(ip)
        );
    }

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

        const index = GeolocationController.ipToLocation(data, ip);

        res.send({
            ip: ip,
            countryCode: data[index][2],
            country: data[index][3].replace('\r', ''),
        });
    }
}

export default new GeolocationController();
