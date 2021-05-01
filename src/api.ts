import express, { Request, Response } from 'express'
import cors from 'cors'
import { createStripCheckoutSession } from './checkout'
import { createPaymentIntent } from './payments'
import { handleStripeWebhook } from './webhooks'
import { runAsync } from './helpers'

export const app = express()

/**
 * MIDDLEWARE
 */

app.use(
  express.json({
    verify: (req: Request, _res, buffer) => (req.rawBody = buffer),
  })
)

app.use(cors({ origin: 'http://localhost:3000' }))

app.use((req, _res, next) => {
  console.log('[ROUTE]', req.url)
  next()
})

/**
 * MAIN API
 */

// app.post('/test', (req: Request, res: Response) => {
//   const { amount } = req.body
//   res.send({ with_tax: amount * 7 })
// })

// * Checkouts
app.post(
  '/checkouts',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createStripCheckoutSession(body.line_items))
  })
)

// * Payment Intents API
app.post(
  '/payments',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createPaymentIntent(body.amount))
  })
)

/**
 * WEBHOOKS
 */
// * Handle Webhooks
app.post('/hooks', runAsync(handleStripeWebhook))
