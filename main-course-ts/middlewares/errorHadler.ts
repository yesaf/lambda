import { Request, Response } from "express";

export default async function errorHandler(
    err: Error,
    req: Request,
    res: Response
) {
    console.log(err);
    res.status(500).send("Something went wrong");
}
