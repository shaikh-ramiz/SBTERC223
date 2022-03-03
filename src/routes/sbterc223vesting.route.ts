import { Request, Response, Router } from "express";
import getResponse from "../config/response.config";

import SBTERC223VetingController from "../controllers/sbterc223vesting.controller";

const sbtERC223VestingController = new SBTERC223VetingController();

const sbtERC223VestingRouter = Router();

sbtERC223VestingRouter.get("/start", async (_req: Request, res: Response) => {
  try {
    const result = await sbtERC223VestingController.start();
    return getResponse(res, result);
  } catch (error) {
    return getResponse(res, { success: false, error: error });
  }
});

sbtERC223VestingRouter.get(
  "/duration",
  async (_req: Request, res: Response) => {
    try {
      const result = await sbtERC223VestingController.duration();
      return getResponse(res, result);
    } catch (error) {
      return getResponse(res, { success: false, error: error });
    }
  }
);

sbtERC223VestingRouter.get(
  "/beneficiaryBalances",
  async (_req: Request, res: Response) => {
    try {
      const beneficiary = _req?.body?.beneficiary;
      const result = await sbtERC223VestingController.beneficiaryBalance(
        beneficiary
      );
      return getResponse(res, result);
    } catch (error) {
      return getResponse(res, { success: false, error: error });
    }
  }
);

sbtERC223VestingRouter.post(
  "/released",
  async (_req: Request, res: Response) => {
    try {
      const beneficiary = _req?.body?.beneficiary;
      const result = await sbtERC223VestingController.released(beneficiary);
      return getResponse(res, result);
    } catch (error) {
      return getResponse(res, { success: false, error: error });
    }
  }
);

sbtERC223VestingRouter.post(
  "/release",
  async (_req: Request, res: Response) => {
    try {
      const beneficiary = _req?.body?.beneficiary;
      const result = await sbtERC223VestingController.release(beneficiary);
      return getResponse(res, result);
    } catch (error) {
      return getResponse(res, { success: false, error: error });
    }
  }
);

sbtERC223VestingRouter.post(
  "/createVestingSchedule",
  async (_req: Request, res: Response) => {
    try {
      const beneficiary: string = _req?.body?.beneficiary;
      const amount: number = _req?.body?.amount;
      const result = await sbtERC223VestingController.createVestingSchedule(
        beneficiary,
        amount
      );
      return getResponse(res, result);
    } catch (error) {
      return getResponse(res, { success: false, error: error });
    }
  }
);

sbtERC223VestingRouter.post(
  "/withdraw",
  async (_req: Request, res: Response) => {
    try {
      const beneficiary = _req?.body?.beneficiary;
      const amount = _req?.body?.amount;
      const result = await sbtERC223VestingController.withdraw(
        beneficiary,
        amount
      );
      return getResponse(res, result);
    } catch (error) {
      return getResponse(res, { success: false, error: error });
    }
  }
);

export default sbtERC223VestingRouter;
