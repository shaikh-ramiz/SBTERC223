import { Request, Response, Router } from "express";
import getResponse from "../config/response.config";

const sbtERC223Router = Router();

import SBTERC223Controller from "../controllers/sbterc223.controller";

const sbtERC223Controller = new SBTERC223Controller();

sbtERC223Router.get("/standard", async (_req: Request, res: Response) => {
  try {
    const result = await sbtERC223Controller.standard();
    return getResponse(res, result);
  } catch (error) {
    return getResponse(res, { success: false, error: error });
  }
});

sbtERC223Router.get("/name", async (_req: Request, res: Response) => {
  try {
    const result = await sbtERC223Controller.name();
    return getResponse(res, result);
  } catch (error) {
    return getResponse(res, { success: false, error: error });
  }
});

sbtERC223Router.get("/symbol", async (_req: Request, res: Response) => {
  try {
    const result = await sbtERC223Controller.symbol();
    return getResponse(res, result);
  } catch (error) {
    return getResponse(res, { success: false, error: error });
  }
});

sbtERC223Router.get("/decimals", async (_req: Request, res: Response) => {
  try {
    const result = await sbtERC223Controller.decimals();
    return getResponse(res, result);
  } catch (error) {
    return getResponse(res, { success: false, error: error });
  }
});

sbtERC223Router.get("/totalSupply", async (_req: Request, res: Response) => {
  try {
    const result = await sbtERC223Controller.totalSupply();
    return getResponse(res, result);
  } catch (error) {
    return getResponse(res, { success: false, error: error });
  }
});

sbtERC223Router.post("/balanceOf", async (_req: Request, res: Response) => {
  try {
    const accountAddress = _req?.body?.accountAddress;
    const result = await sbtERC223Controller.balanceOf(accountAddress);
    return getResponse(res, result);
  } catch (error) {
    return getResponse(res, { success: false, error: error });
  }
});

sbtERC223Router.post("/transfer", async (_req: Request, res: Response) => {
  try {
    const receiverAddress = _req?.body?.receiverAddress;
    const tokenAmount = _req?.body?.numOfTokens;
    const transactionMetadata = _req?.body?.transactionMetadata;
    const result = await sbtERC223Controller.transfer(
      receiverAddress,
      tokenAmount,
      transactionMetadata
    );
    return getResponse(res, result);
  } catch (error) {
    return getResponse(res, { success: false, error: error });
  }
});

sbtERC223Router.post("/transferFrom", async (_req: Request, res: Response) => {
  try {
    const senderAddress = _req?.body?.senderAddress;
    const receiverAddress = _req?.body?.receiverAddress;
    const tokenAmount = _req?.body?.numOfTokens;
    const transactionMetadata = _req?.body?.transactionMetadata;
    const result = await sbtERC223Controller.transferFrom(
      senderAddress,
      receiverAddress,
      tokenAmount,
      transactionMetadata
    );
    return getResponse(res, result);
  } catch (error) {
    return getResponse(res, { success: false, error: error });
  }
});

export default sbtERC223Router;
