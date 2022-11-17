import express from 'express';
import bodyParser from "body-parser";
import * as http from 'http';
import AppRouter from './mainRouter';

require("dotenv").config();

const app = express();
const router = new AppRouter(app);

app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.init();

const port = app.get("port");
const server = http.createServer(app);

server.listen(port, () =>
    console.log(`Server started on port ${port}`)
);
