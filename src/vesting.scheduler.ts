import { config } from "dotenv";

import moment from "moment";
import { exit } from "process";

import SBTERC223Controller from "./controllers/sbterc223.controller";
import SBTERC223VestingController from "./controllers/sbterc223vesting.controller";

config();

const sbtERC223Controller = new SBTERC223Controller();
const sbtERC223VestingController = new SBTERC223VestingController();

const benficiaries = [
  process.env.INVESTOR_ADDRESS,
  process.env.ADVISOR_ADDRESS,
  process.env.TEAM_ADDRESS,
];

const beneficiaryTokens = [
  +process.env.INVESTOR_TOKENS,
  +process.env.ADVISOR_TOKENS,
  +process.env.TEAM_TOKENS,
];

const dateTimeFormat = "MMMM Do YYYY, h:mm:ss a";

const release = async (counter: number = 0, allReleased: Boolean = false) => {
  const benficiaries = [
    process.env.INVESTOR_ADDRESS,
    process.env.ADVISOR_ADDRESS,
    process.env.TEAM_ADDRESS,
  ];

  // Checking Vesting Contract balance to kill the loop
  const contractBalanceResult = await sbtERC223Controller.balanceOf(
    process.env.VESTING_CONTRACT
  );

  // Looping call for release of tokens for beneficiary
  for (let index = 0; index <= counter; index++) {
    const beneficiary = benficiaries[index];
    // Checking balance of beneficiary before tokens released
    const balanceResult = await sbtERC223Controller.balanceOf(beneficiary);
    balanceResult?.success
      ? console.info(
          `${moment().format(
            dateTimeFormat
          )} - Balance of BENEFICIARY_${index} BEFORE RELEASE ${
            balanceResult?.json?.address
          }: `,
          balanceResult?.json?.balance
        )
      : console.error(`balanceOf:`, balanceResult?.error);

    // Calling release of tokens for beneficiary
    // const result = await sbtERC223VestingController.release(beneficiary);
    // result?.success
    //   ? console.info(
    //       `${moment().format(dateTimeFormat)} - Result: `,
    //       result?.json?.data
    //     )
    //   : console.error(`releaseTokens:`, result?.error);

    // Checking balance of beneficiary after tokens released
    const balanceResultAfter = await sbtERC223Controller.balanceOf(beneficiary);
    balanceResultAfter?.success
      ? console.info(
          `${moment().format(
            dateTimeFormat
          )} - Balance of BENEFICIARY_${index} AFTER RELEASE ${
            balanceResultAfter?.json?.address
          }: `,
          balanceResultAfter?.json?.balance
        )
      : console.error(`balanceOf:`, balanceResultAfter?.error);
  }

  allReleased = contractBalanceResult?.success
    ? contractBalanceResult?.json?.balance <= 0
      ? true
      : false
    : false;

  // Recurring Function Logic
  if (counter <= benficiaries.length - 1) {
    if (allReleased) {
      exit();
    } else if (allReleased && counter === benficiaries.length) {
      console.info(`All Tokens Released`);
    } else {
      counter = counter === benficiaries.length - 1 ? 0 : counter + 1;
      // Calling function again in 3 minutes
      setInterval(async function reRunner() {
        await release(counter, allReleased);
      }, 180000);
    }
  }
};

const main = async () => {
  // Calling recurring release function after 3 minutes
  release(0);
  // setTimeout(release, 180000);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

export default main;
