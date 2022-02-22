import { config } from 'dotenv'

import express, { json, urlencoded } from 'express'

import sbtERC223Router from './routes/sbterc223.route'
import sbtERC223VestingRouter from './routes/sbterc223vesting.route'
import sbtERC223RecipientRouter from './routes/sbterc223recipient.route'

config()
const app = express()
const port = process.env.SERVER_PORT

app.use(
  urlencoded({
    extended: true,
  }),
)

app.use(json())

app.use('/sbtERC223', sbtERC223Router)
app.use('/sbtERC223Vesting', sbtERC223VestingRouter)
app.use('/sbtERC223Recipient', sbtERC223RecipientRouter)

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`)
})
