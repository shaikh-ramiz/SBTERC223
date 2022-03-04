import BigNumber from "big-number";

import { SBTERC223ContractInstance, web3 } from "../config/blockchain.config";

class SBTERC223Controller {
  async standard() {
    try {
      const sbtERC223ContractInstance = await SBTERC223ContractInstance();
      const tokenStandard = await sbtERC223ContractInstance.standard.call();
      return { success: true, json: { standard: tokenStandard } };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async name() {
    try {
      const sbtERC223ContractInstance = await SBTERC223ContractInstance();
      const tokenName = await sbtERC223ContractInstance.name.call();
      return { success: true, json: { name: tokenName } };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async symbol() {
    try {
      const sbtERC223ContractInstance = await SBTERC223ContractInstance();
      const tokenSymbol = await sbtERC223ContractInstance.symbol.call();
      return { success: true, json: { symbol: tokenSymbol } };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async decimals() {
    try {
      const sbtERC223ContractInstance = await SBTERC223ContractInstance();
      const decimals = await sbtERC223ContractInstance.decimals.call();
      return { success: true, json: { decimals: decimals.toNumber() } };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async totalSupply() {
    try {
      const sbtERC223ContractInstance = await SBTERC223ContractInstance();
      const tokenTotalSupply =
        await sbtERC223ContractInstance.totalSupply.call();
      const decimalValue = (await this.decimals())?.json?.decimals;
      return {
        success: true,
        json: {
          totalSupply: tokenTotalSupply?.toNumber() / decimalValue,
        },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async balanceOf(accountAddress: string) {
    try {
      const sbtERC223ContractInstance = await SBTERC223ContractInstance();
      const tokenBalance = await sbtERC223ContractInstance.balanceOf.call(
        accountAddress
      );
      const decimalValue = (await this.decimals())?.json?.decimals;
      const tokenBalanceNum = tokenBalance?.toNumber();
      return {
        success: true,
        json: {
          address: accountAddress,
          balance: tokenBalanceNum / decimalValue,
        },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async transfer(
    receiverAddress: string,
    tokenAmount: number,
    data: string = null
  ) {
    try {
      const sbtERC223ContractInstance = await SBTERC223ContractInstance();
      const coinbase = await web3.eth.getCoinbase();
      const decimalValue = (await this.decimals())?.json?.decimals;
      tokenAmount = BigNumber(tokenAmount).multiply(
        BigNumber(10).power(decimalValue)
      );
      if (data?.length === 0 || data === null || data === undefined) {
        const response = await sbtERC223ContractInstance.methods[
          "transfer(address,uint256)"
        ](receiverAddress, tokenAmount, {
          from: coinbase,
          to: receiverAddress,
        });
        return {
          success: true,
          json: {
            address: receiverAddress,
            amount: tokenAmount,
            transactionHash: response?.tx,
          },
        };
      }
      const response = await sbtERC223ContractInstance.methods[
        "transfer(address,uint256,bytes)"
      ](receiverAddress, tokenAmount, data, {
        from: coinbase,
        to: receiverAddress,
      });
      return {
        success: true,
        json: {
          address: receiverAddress,
          amount: tokenAmount,
          transactionHash: response?.tx,
        },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async transferFrom(
    senderAddress: string,
    receiverAddress: string,
    tokenAmount: number,
    data: string = null
  ) {
    try {
      const sbtERC223ContractInstance = await SBTERC223ContractInstance();
      const coinbase = await web3.eth.getCoinbase();
      const decimalValue = (await this.decimals())?.json?.decimals;
      tokenAmount = BigNumber(tokenAmount).multiply(
        BigNumber(10).power(decimalValue)
      );
      if (data?.length === 0 || data === null || data === typeof undefined) {
        const response = await sbtERC223ContractInstance.methods[
          "transferFrom(address,address,uint256)"
        ](senderAddress, receiverAddress, tokenAmount, {
          from: coinbase,
          to: receiverAddress,
        });
        return {
          success: true,
          json: {
            address: receiverAddress,
            amount: tokenAmount,
            transactionHash: response?.tx,
          },
        };
      }
      const response = await sbtERC223ContractInstance.methods[
        "transferFrom(address,address,uint256,bytes)"
      ](senderAddress, receiverAddress, tokenAmount, data, {
        from: coinbase,
        to: receiverAddress,
      });
      return {
        success: true,
        json: {
          address: receiverAddress,
          amount: tokenAmount,
          transactionHash: response?.tx,
        },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }
}

export default SBTERC223Controller;
