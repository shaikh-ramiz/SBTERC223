import { Response } from "express";

const getResponse = (res: Response, data: any) => {
  res.statusCode = data.success ? 200 : 500;
  return data.success
    ? res.json(data.json)
    : res.json(data.error.toString());
};

export default getResponse;
