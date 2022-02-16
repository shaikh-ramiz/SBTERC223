import Web3 from 'web3'
import contract from 'truffle-contract'

import truffleConfig from '../../truffle-config.js'
import SBTERC223 from '../../build/contracts/SBTERC223.json'
import SBTERC223Recipient from '../../build/contracts/SBTERC223Recipient.json'

const host = truffleConfig.networks.development.host
const port = truffleConfig.networks.development.port
const providerUrl = `http://${host}:${port}`
export const web3 = new Web3(providerUrl)

let sbtERC223ContractInstance: any, sbtERC223RecipientContractInstance: any

const SBTERC223Contract = contract(SBTERC223)
SBTERC223Contract.setProvider(providerUrl)

const SBTERC223RecipientContract = contract(SBTERC223Recipient)
SBTERC223RecipientContract.setProvider(providerUrl)

export const SBTERC223ContractInstance = async () => {
  if (sbtERC223ContractInstance !== typeof undefined) {
    sbtERC223ContractInstance = await SBTERC223Contract.deployed()
  }
  return sbtERC223ContractInstance
}

export const SBTERC223RecipientContractInstance = async () => {
  if (sbtERC223RecipientContractInstance !== typeof undefined){
    sbtERC223RecipientContractInstance = await SBTERC223RecipientContract.deployed()
  }
  return sbtERC223RecipientContractInstance
}
