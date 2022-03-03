const dotenv = require('dotenv')
dotenv.config()

const moment = require('moment')

const SBTERC223 = artifacts.require('SBTERC223')
const SBTERC223Recipient = artifacts.require('SBTERC223Recipient')
const SBTERC223Vesting = artifacts.require('SBTERC223Vesting')

const INVESTOR_ADDRESS = process.env.INVESTOR_ADDRESS
const ADVISOR_ADDRESS = process.env.ADVISOR_ADDRESS
const TEAM_ADDRESS = process.env.TEAM_ADDRESS

// const totalSupply = 400000000,
//   name = 'SBTERC223',
//   symbol = 'SBT',
//   decimals = 18

module.exports = async function (deployer) {
  // await deployer.deploy(SBTERC223, totalSupply, name, symbol, decimals)
  await deployer.deploy(SBTERC223).then(async (instance) => {
    const token_contract_address = instance.address
    // const token_contract_address = "0xE69D991828dA1448105754fdf9F4cb868E0ab9B5"
    const timestamp = moment().unix()
    await deployer.deploy(SBTERC223Vesting, timestamp, INVESTOR_ADDRESS, ADVISOR_ADDRESS, TEAM_ADDRESS, token_contract_address);
  });
  await deployer.deploy(SBTERC223Recipient)
}
