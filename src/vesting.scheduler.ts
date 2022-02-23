import { config } from "dotenv";
import schedule from "node-schedule";
import SBTERC223Controller from "./controllers/sbterc223.controller";
import SBTERC223VestingController from "./controllers/sbterc223vesting.controller";

config();

const rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 10);

const sbtERC223Controller = new SBTERC223Controller();
const sbtERC223VestingController = new SBTERC223VestingController();

const investorAddress = process.env.INVESTOR_ADDRESS;
const investorTokens = +process.env.INVESTOR_TOKENS;

const advisorAddress = process.env.ADVISOR_ADDRESS;
const advisorTokens = +process.env.ADVISOR_TOKENS;

const teamAddress = process.env.TEAM_ADDRESS;
const teamTokens = +process.env.TEAM_TOKENS;

sbtERC223VestingController
  .createVestingSchedule(investorAddress, investorTokens)
  .then((result) => {
    console.info(`INVESTOR: `, result);
  });

sbtERC223VestingController
  .createVestingSchedule(advisorAddress, advisorTokens)
  .then((result) => {
    console.info(`ADVISOR: `, result);
  });

sbtERC223VestingController
  .createVestingSchedule(teamAddress, teamTokens)
  .then((result) => {
    console.info(`TEAM: `, result);
  });

async function releaseTokens(benficiary: string) {
  const result = await sbtERC223VestingController.release(benficiary);
  console.info(`Result: `, result?.json?.transaction);
  const balanceResult = await sbtERC223Controller.balanceOf(benficiary);
  console.info(
    `Balance of ${balanceResult?.json?.address}: `,
    balanceResult?.json?.balance
  );
}

schedule.scheduleJob(rule, async () => {
  await releaseTokens(investorAddress);
});

schedule.scheduleJob(rule, async () => {
  await releaseTokens(advisorAddress);
});

schedule.scheduleJob(rule, async () => {
  await releaseTokens(teamAddress);
});

console.info(`Wait For Results`);
