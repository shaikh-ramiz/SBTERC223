import {
  SBTERC223RecipientContractInstance,
  web3,
} from '../config/blockchain.config'

class SBTERC223RecipientController {
  async tokenBalance(contractAddress: string) {
    const sbtERC223RecipientContractInstance = await SBTERC223RecipientContractInstance()
    const tokenBalance = await sbtERC223RecipientContractInstance.tokenBalance.call(
      contractAddress,
    )
    return { address: contractAddress, balance: tokenBalance.toNumber() }
  }

  async tokenBalanceSender(contractAddress: string, sender: string) {
    const sbtERC223RecipientContractInstance = await SBTERC223RecipientContractInstance()
    const tokenBalanceSender = await sbtERC223RecipientContractInstance.tokenBalanceSender.call(
      contractAddress,
      sender,
    )
    return {
      contractAddress: contractAddress,
      senderAddress: sender,
      balance: tokenBalanceSender.toNumber(),
    }
  }

  async transferHistory(contractAddress: string, sender: string) {
    const sbtERC223RecipientContractInstance = await SBTERC223RecipientContractInstance()
    const transferHistory = await sbtERC223RecipientContractInstance.transferHistory.call(
      contractAddress,
      sender,
    )
    return {
      contractAddress: contractAddress,
      senderAddress: sender,
      history: transferHistory,
    }
  }

  async transfer(
    contractAddress: string,
    amount: number,
    transactionMetadata: string,
  ) {
    const sbtERC223RecipientContractInstance = await SBTERC223RecipientContractInstance()
    const response = await sbtERC223RecipientContractInstance.transfer(
      contractAddress,
      amount,
      transactionMetadata,
      {
        from: await web3.eth.getCoinbase(),
      },
    )
    return {
      contractAddress: contractAddress,
      transactionMetadata: transactionMetadata,
      transactionHash: response?.tx,
    }
  }
}

export default SBTERC223RecipientController
