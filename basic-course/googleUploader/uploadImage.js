import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import fs from 'fs';

const KEY_FILE_PATH = './ServiceAccountCredentials.json';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

export default async function(path, fileName) {
    const auth = new GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: SCOPES,
    });

    const service = google.drive({ version: 'v3', auth });
    const fileMetadata = {
        name: fileName,
        parents: ['1afTBwcayAYyjluLTaiLeyM-oW8Dc4y6B'],
    };

    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(path),
    };

    try {
        const file = await service.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });
        return file.data.id;
    } catch (err) {
        throw err;
    }
}
