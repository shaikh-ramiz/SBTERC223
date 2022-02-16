import { Request, Response, Router } from 'express'

const sbtERC223Router = Router()

import SBTERC223Controller from '../controllers/sbterc223.controller'

const sbtERC223Controller = new SBTERC223Controller()

sbtERC223Router.get('/standard', async (req: Request, res: Response) => {
  const tokenStandard = await sbtERC223Controller.standard()
  res.json(tokenStandard)
})

sbtERC223Router.get('/name', async (req: Request, res: Response) => {
  const tokenName = await sbtERC223Controller.name()
  res.json(tokenName)
})

sbtERC223Router.get('/symbol', async (req: Request, res: Response) => {
  const tokenSymbol = await sbtERC223Controller.symbol()
  res.json(tokenSymbol)
})

sbtERC223Router.get('/decimals', async (req: Request, res: Response) => {
  const tokenDecimals = await sbtERC223Controller.decimals()
  res.json(tokenDecimals)
})

sbtERC223Router.get('/totalSupply', async (req: Request, res: Response) => {
  const tokenTotalSupply = await sbtERC223Controller.totalSupply()
  res.json(tokenTotalSupply)
})

sbtERC223Router.post('/balanceOf', async (req: Request, res: Response) => {
  const accountAddress = req.body.accountAddress
  const tokenBalance = await sbtERC223Controller.balanceOf(accountAddress)
  res.json(tokenBalance)
})

sbtERC223Router.post('/transfer', async (req: Request, res: Response) => {
  const receiverAddress = req.body.receiverAddress
  const tokenAmount = req.body.numOfTokens
  const transactionMetadata = req.body.transactionMetadata
  const transactionHash = await sbtERC223Controller.transfer(
    receiverAddress,
    tokenAmount,
    transactionMetadata,
  )
  res.json(transactionHash)
})

export default sbtERC223Router
