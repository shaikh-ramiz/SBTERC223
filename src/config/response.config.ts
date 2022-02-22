import { Response } from "express";

const getResponse = (res: Response, data: any) => {
  if (data.success) {
    res.statusCode = 200;
    res.json(data.json);
  } else {
    res.sendStatus(500);
    res.json(data.error);
  }
  return res;
};

export default getResponse;
