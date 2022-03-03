import { Request, Response, Router } from "express";
import getResponse from "../config/response.config";

import SBTERC223RecipientController from "../controllers/sbterc223recipient.controller";

const sbtERC223RecipientController = new SBTERC223RecipientController();

const sbtERC223RecipientRouter = Router();

sbtERC223RecipientRouter.post(
  "/tokenBalance",
  async (_req: Request, res: Response) => {
    try {
      const contractAddress = _req?.body?.contractAddress;
      const result = await sbtERC223RecipientController.tokenBalance(
        contractAddress
      );
      return getResponse(res, result);
    } catch (error) {
      return getResponse(res, { success: false, error: error });
    }
  }
);

sbtERC223RecipientRouter.post(
  "/tokenBalanceSender",
  async (_req: Request, res: Response) => {
    try {
      const contractAddress = _req?.body?.contractAddress;
      const sender = _req?.body?.sender;
      const result =
        await sbtERC223RecipientController.tokenBalanceSender(
          contractAddress,
          sender
        );
        return getResponse(res, result);
    } catch (error) {
      return getResponse(res, { success: false, error: error });
    }
  }
);

sbtERC223RecipientRouter.post(
  "/transferHistory",
  async (_req: Request, res: Response) => {
    try {
      const contractAddress = _req?.body?.contractAddress;
      const sender = _req?.body?.sender;
      const result =
        await sbtERC223RecipientController.transferHistory(
          contractAddress,
          sender
        );
        return getResponse(res, result);
    } catch (error) {
      return getResponse(res, { success: false, error: error });
    }
  }
);

sbtERC223RecipientRouter.post(
  "/transfer",
  async (_req: Request, res: Response) => {
    try {
      const contractAddress = _req?.body?.contractAddress;
      const sender = _req?.body?.sender;
      const amount = _req?.body?.amount;
      const transactionMetadata = _req?.body?.transactionMetadata;
      const result = await sbtERC223RecipientController.transfer(
        contractAddress,
        sender,
        amount,
        transactionMetadata
      );
      return getResponse(res, result);
    } catch (error) {
      return getResponse(res, { success: false, error: error });
    }
  }
);
export default sbtERC223RecipientRouter;
