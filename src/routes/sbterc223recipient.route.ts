import { Request, Response, Router } from 'express'

import SBTERC223RecipientController from '../controllers/sbterc223recipient.controller'

const sbtERC223RecipientController = new SBTERC223RecipientController()

const sbtERC223RecipientRouter = Router()

sbtERC223RecipientRouter.post(
  '/tokenBalance',
  async (req: Request, res: Response) => {
    const contractAddress = req.body.contractAddress
    const tokenBalance = await sbtERC223RecipientController.tokenBalance(
      contractAddress,
    )
    res.json(tokenBalance)
  },
)

sbtERC223RecipientRouter.post(
  '/tokenBalanceSender',
  async (req: Request, res: Response) => {
    const contractAddress = req.body.contractAddress
    const sender = req.body.sender
    const tokenBalanceSender = await sbtERC223RecipientController.tokenBalanceSender(
      contractAddress,
      sender,
    )
    res.json(tokenBalanceSender)
  },
)

sbtERC223RecipientRouter.post(
  '/transferHistory',
  async (req: Request, res: Response) => {
    const contractAddress = req.body.contractAddress
    const sender = req.body.sender
    const transferHistory = await sbtERC223RecipientController.transferHistory(
      contractAddress,
      sender,
    )
    res.json(transferHistory)
  },
)

sbtERC223RecipientRouter.post(
  '/transfer',
  async (req: Request, res: Response) => {
    const contractAddress = req.body.contractAddress
    const amount = req.body.amount
    const transactionMetadata = req.body.transactionMetadata
    const transferResponse = await sbtERC223RecipientController.transfer(
      contractAddress,
      amount,
      transactionMetadata,
    )
    res.json(transferResponse)
  },
)
export default sbtERC223RecipientRouter
