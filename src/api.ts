import express, { Request, Response } from 'express'
import cors from 'cors'

import { runAsync, validateUser } from './helpers'
import { decodeJWT } from './middleware'
import { createStripCheckoutSession } from './api/checkout'
import { createPaymentIntent } from './api/payments'
import { handleStripeWebhook } from './api/webhooks'
import { createSetupIntent, listPaymentMethods } from './api/customers'
import {
  cancelSubscription,
  createSubscription,
  listSubscriptions,
} from './api/billing'

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

// * Log incoming request
app.use((req, _res, next) => {
  console.log('[ROUTE]', req.url)
  next()
})

// * Decodes the Firebase JSON Web Token
app.use(decodeJWT)

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

/**
 * Customers and Setup Intents
 */

// * Save a card on the customer record with a SetupIntent
app.post(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req)
    const setupIntent = await createSetupIntent(user.uid)
    res.send(setupIntent)
  })
)

// * Retrieve all cards attached to a customer
app.get(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req)

    const wallet = await listPaymentMethods(user.uid)
    res.send(wallet.data)
  })
)

/**
 * Billing and Recurring Subscriptions
 */

// * Create a and charge new Subscription
app.post(
  '/subscriptions',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req)
    const { plan, payment_method } = req.body
    const subscription = await createSubscription(
      user.uid,
      plan,
      payment_method
    )
    res.send(subscription)
  })
)

// * Get all subscriptions for a customer
app.get(
  '/subscriptions',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req)

    const subscriptions = await listSubscriptions(user.uid)

    res.send(subscriptions.data)
  })
)

// * Unsubscribe or cancel a subscription
app.patch(
  '/subscriptions/:id',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req)
    res.send(await cancelSubscription(user.uid, req.params.id))
  })
)
