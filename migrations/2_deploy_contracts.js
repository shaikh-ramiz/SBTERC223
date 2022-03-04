const dotenv = require('dotenv')
dotenv.config()

const BigNumber = require('big-number')
const moment = require('moment')

const SBTERC223 = artifacts.require('SBTERC223')
const SBTERC223Vesting = artifacts.require('SBTERC223Vesting')
// const SBTERC223Recipient = artifacts.require('SBTERC223Recipient')

const benficiaries = [
  process.env.INVESTOR_ADDRESS,
  process.env.ADVISOR_ADDRESS,
  process.env.TEAM_ADDRESS,
];

const totalSupply = 400000000,
  name = 'SBTERC223',
  symbol = 'SBT',
  decimals = 18

const beneficiaryTokens = [
  BigNumber(+process.env.INVESTOR_TOKENS).multiply(BigNumber(10).power(decimals)),
  BigNumber(+process.env.ADVISOR_TOKENS).multiply(BigNumber(10).power(decimals)),
  BigNumber(+process.env.TEAM_TOKENS).multiply(BigNumber(10).power(decimals)),
];

module.exports = async function (deployer) {
  const supply = BigNumber(totalSupply).multiply(BigNumber(10).power(decimals));
  await deployer.deploy(SBTERC223, supply, name, symbol, decimals).then(async (instance) => {
    const token_contract_address = instance.address
    const timestamp = moment().unix()
    await deployer.deploy(SBTERC223Vesting, timestamp, benficiaries[0], benficiaries[1], benficiaries[2], token_contract_address).then(async (vestingInstance) => {
      // Creating vesting schedule for all beneficiaries
      await vestingInstance.createVestingSchedule.sendTransaction(
        benficiaries[0],
        beneficiaryTokens[0])
      await vestingInstance.createVestingSchedule.sendTransaction(
        benficiaries[1],
        beneficiaryTokens[1])
      await vestingInstance.createVestingSchedule.sendTransaction(
        benficiaries[2],
        beneficiaryTokens[2])
    });
    // await deployer.deploy(SBTERC223Recipient);
  });
}
