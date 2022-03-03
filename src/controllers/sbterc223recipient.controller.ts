import {
  SBTERC223RecipientContractInstance,
  web3,
} from "../config/blockchain.config";

class SBTERC223RecipientController {
  async tokenBalance(contractAddress: string) {
    try {
      const sbtERC223RecipientContractInstance =
        await SBTERC223RecipientContractInstance();
      const tokenBalance =
        await sbtERC223RecipientContractInstance.tokenBalance.call(
          contractAddress
        );
      return {
        success: true,
        json: { address: contractAddress, balance: tokenBalance?.toNumber() },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async tokenBalanceSender(contractAddress: string, sender: string) {
    try {
      const sbtERC223RecipientContractInstance =
        await SBTERC223RecipientContractInstance();
      const tokenBalanceSender =
        await sbtERC223RecipientContractInstance.tokenBalanceSender.call(
          contractAddress,
          sender
        );
      return {
        success: true,
        json: {
          contractAddress: contractAddress,
          senderAddress: sender,
          balance: tokenBalanceSender?.toNumber(),
        },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async transferHistory(contractAddress: string, sender: string) {
    try {
      const sbtERC223RecipientContractInstance =
        await SBTERC223RecipientContractInstance();
      const transferHistory =
        await sbtERC223RecipientContractInstance.transferHistory.call(
          contractAddress,
          sender
        );
      return {
        success: true,
        json: {
          contractAddress: contractAddress,
          senderAddress: sender,
          history: transferHistory,
        },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async transfer(
    contractAddress: string,
    sender: string,
    amount: number,
    transactionMetadata: string
  ) {
    try {
      const sbtERC223RecipientContractInstance =
        await SBTERC223RecipientContractInstance();
      const response = await sbtERC223RecipientContractInstance.transfer(
        contractAddress,
        sender,
        amount,
        transactionMetadata,
        {
          from: await web3.eth.getCoinbase(),
        }
      );
      return {
        success: true,
        json: {
          contractAddress: contractAddress,
          transactionMetadata: transactionMetadata,
          transactionHash: response?.tx,
        },
      };
    } catch (error) {
      return { success: false, error: error };
    }
  }
}

export default SBTERC223RecipientController;
