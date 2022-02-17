const SBTERC223 = artifacts.require('SBTERC223')
const SBTERC223Recipient = artifacts.require('SBTERC223Recipient')

// const totalSupply = 400000000,
//   name = 'SBTERC223',
//   symbol = 'SBT',
//   decimals = 18

module.exports = async function (deployer) {
  // await deployer.deploy(SBTERC223, totalSupply, name, symbol, decimals)
  await deployer.deploy(SBTERC223)
  await deployer.deploy(SBTERC223Recipient)
}
