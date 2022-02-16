import { SBTERC223ContractInstance, web3 } from '../config/blockchain.config'

class SBTERC223Controller {
  async standard() {
    const sbtERC223ContractInstance = await SBTERC223ContractInstance()
    const tokenStandard = await sbtERC223ContractInstance.standard.call()
    return { standard: tokenStandard }
  }

  async name() {
    const sbtERC223ContractInstance = await SBTERC223ContractInstance()
    const tokenName = await sbtERC223ContractInstance.name.call()
    return { name: tokenName }
  }

  async symbol() {
    const sbtERC223ContractInstance = await SBTERC223ContractInstance()
    const tokenSymbol = await sbtERC223ContractInstance.symbol.call()
    return { symbol: tokenSymbol }
  }

  async decimals() {
    const sbtERC223ContractInstance = await SBTERC223ContractInstance()
    const tokenDecimals = await sbtERC223ContractInstance.decimals.call()
    return { decimals: tokenDecimals.toNumber() }
  }

  async totalSupply() {
    const sbtERC223ContractInstance = await SBTERC223ContractInstance()
    const tokenTotalSupply = await sbtERC223ContractInstance.totalSupply.call()
    return { totalSupply: tokenTotalSupply.toNumber() }
  }

  async balanceOf(accountAddress: string) {
    const sbtERC223ContractInstance = await SBTERC223ContractInstance()
    const tokenBalance = await sbtERC223ContractInstance.balanceOf.call(
      accountAddress,
    )
    return { address: accountAddress, balance: tokenBalance.toNumber() }
  }

  async transfer(
    receiverAddress: string,
    tokenAmount: number,
    data: string = null,
  ) {
    const sbtERC223ContractInstance = await SBTERC223ContractInstance()
    const coinbase = await web3.eth.getCoinbase()
    if (data?.length === 0 || data === null || data === typeof undefined) {
      const response = await sbtERC223ContractInstance.methods['transfer(address,uint256)'](
        receiverAddress,
        tokenAmount,
        {
          from: coinbase,
          to: receiverAddress,
        },
      )
      return {
        address: receiverAddress,
        amount: tokenAmount,
        transactionHash: response?.tx,
      }
    }
    const response = await sbtERC223ContractInstance.methods['transfer(address,uint256,bytes)'](
      receiverAddress,
      tokenAmount,
      data,
      {
        from: coinbase,
        to: receiverAddress,
      },
    )
    return {
      address: receiverAddress,
      amount: tokenAmount,
      transactionHash: response?.tx,
    }
  }
}

export default SBTERC223Controller
