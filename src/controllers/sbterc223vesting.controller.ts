import BigNumber from "big-number";

import {
  SBTERC223VestingContractInstance,
  web3,
} from "../config/blockchain.config";
import SBTERC223Controller from "./sbterc223.controller";

class SBTERC223VestingController {
  async start() {
    try {
      const sbtERC223VestingContractInstance =
        await SBTERC223VestingContractInstance();
      const vestingStartTime =
        await sbtERC223VestingContractInstance.start.call();
      return {
        success: true,
        json: { vestingStartTime: vestingStartTime?.toNumber() },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async duration() {
    try {
      const sbtERC223VestingContractInstance =
        await SBTERC223VestingContractInstance();
      const vestingDuration =
        await sbtERC223VestingContractInstance.duration.call();
      return {
        success: true,
        json: { vestingDuration: vestingDuration?.toNumber() },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async released(beneficiary: string) {
    try {
      const sbtERC223VestingContractInstance =
        await SBTERC223VestingContractInstance();
      const vestingTokensReleased =
        await sbtERC223VestingContractInstance.released.call(beneficiary);
      const decimalValue = (
        await new SBTERC223Controller().decimals()
      )?.json?.decimals;
      return {
        success: true,
        json: {
          vestingDuration: vestingTokensReleased?.toNumber() / decimalValue,
        },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async release(beneficiary: string) {
    try {
      const sbtERC223VestingContractInstance =
        await SBTERC223VestingContractInstance();
      const coinbase = await web3.eth.getCoinbase();
      const transaction =
        await sbtERC223VestingContractInstance.release.sendTransaction(
          beneficiary,
          {
            from: coinbase,
          }
        );
      const balancesResult = await this.beneficiaryBalance(beneficiary);
      return {
        success: true,
        json: {
          data: {
            address: balancesResult?.json?.balances?.address,
            balance: balancesResult?.json?.balances?.balance,
            transactionHash: transaction.tx,
          },
        },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async createVestingSchedule(beneficiary: string, amount: number) {
    try {
      const sbtERC223VestingContractInstance =
        await SBTERC223VestingContractInstance();
      const coinbase = await web3.eth.getCoinbase();
      const decimalValue = (
        await new SBTERC223Controller().decimals()
      )?.json?.decimals;
      amount = BigNumber(amount).multiply(BigNumber(10).power(decimalValue));
      const createVestingScheduleTransaction =
        await sbtERC223VestingContractInstance.createVestingSchedule.sendTransaction(
          beneficiary,
          amount,
          {
            from: coinbase,
          }
        );
      return {
        success: true,
        json: { transaction: createVestingScheduleTransaction?.tx },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async withdraw(beneficiary: string, amount: number) {
    try {
      const sbtERC223VestingContractInstance =
        await SBTERC223VestingContractInstance();
      const coinbase = await web3.eth.getCoinbase();
      const decimalValue = (
        await new SBTERC223Controller().decimals()
      )?.json?.decimals;
      amount = BigNumber(amount).multiply(BigNumber(10).power(decimalValue));
      const transaction =
        await sbtERC223VestingContractInstance.withdraw.sendTransaction(
          beneficiary,
          amount,
          {
            from: coinbase,
          }
        );
      return {
        success: true,
        json: { transaction: transaction?.tx },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async beneficiaryBalance(beneficiary: string) {
    try {
      const balanceResult = await new SBTERC223Controller().balanceOf(
        beneficiary
      );
      const balances = balanceResult?.success
        ? {
            address: balanceResult?.json?.address,
            balance: balanceResult?.json?.balance,
          }
        : {
            address: beneficiary,
            balance: "unknown",
          };
      return {
        success: true,
        json: { balances: balances },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }
}

export default SBTERC223VestingController;
