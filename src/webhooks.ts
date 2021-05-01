import { Request, Response } from 'express'
import Stripe from 'stripe'
import { stripe } from './'

//  * Business logic for specific webhook event types
const webhookHandlers: WebhookHandlers = {
  'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
    console.log('[payment_intent.succeeded]')
    // TODO: Add your business logic here
  },
  'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) => {
    console.log('[payment_intent.payment_failed]')
    // TODO: Add your business logic here
  },
}

/**
 * * Validate the stripe webhook secret, then call the handler for the event type
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature']!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string
  const event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret)

  try {
    await webhookHandlers[event.type]?.(event.data.object)
    res.send({ received: true })
  } catch (error) {
    console.error(error)
    res.status(400).send(`Webhook Error:c ${error.message}`)
  }
}
