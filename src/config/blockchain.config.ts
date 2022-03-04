import { config } from "dotenv";
import Web3 from "web3";
import contract from "truffle-contract";

config();

import truffleConfig from "../../truffle-config.js";
import SBTERC223 from "../../build/contracts/SBTERC223.json";
import SBTERC223Recipient from "../../build/contracts/SBTERC223Recipient.json";
import SBTERC223Vesting from "../../build/contracts/SBTERC223Vesting.json";

const host = truffleConfig.networks.development.host;
const port = truffleConfig.networks.development.port;

const providerUrl =
  process.env.SETUP === "development"
    ? `http://${host}:${port}`
    : truffleConfig.networks.kovan.provider();

export const web3 = new Web3(providerUrl);

export const gas =
  process.env.SETUP === "development"
    ? truffleConfig.networks.development.gas
    : truffleConfig.networks.kovan.gas;

let sbtERC223ContractInstance: any,
  sbtERC223RecipientContractInstance: any,
  sbtERC223VestingContractInstance: any;

const SBTERC223Contract = contract(SBTERC223);
SBTERC223Contract.setProvider(providerUrl);

const SBTERC223RecipientContract = contract(SBTERC223Recipient);
SBTERC223RecipientContract.setProvider(providerUrl);

const SBTERC223VestingContract = contract(SBTERC223Vesting);
SBTERC223VestingContract.setProvider(providerUrl);

export const SBTERC223ContractInstance = async () => {
  if (sbtERC223ContractInstance === undefined) {
    sbtERC223ContractInstance = await SBTERC223Contract.deployed();
  }
  return sbtERC223ContractInstance;
};

export const SBTERC223RecipientContractInstance = async () => {
  if (sbtERC223RecipientContractInstance === undefined) {
    sbtERC223RecipientContractInstance =
      await SBTERC223RecipientContract.deployed();
  }
  return sbtERC223RecipientContractInstance;
};

export const SBTERC223VestingContractInstance = async () => {
  if (sbtERC223VestingContractInstance === undefined) {
    sbtERC223VestingContractInstance =
      await SBTERC223VestingContract.deployed();
  }
  return sbtERC223VestingContractInstance;
};
