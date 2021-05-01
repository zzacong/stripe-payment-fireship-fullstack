import { Request, Response } from 'express'
import { firestore } from 'firebase-admin'
import Stripe from 'stripe'
import { stripe } from '../'
import { db } from '../firebase'

//  * Business logic for specific webhook event types
const webhookHandlers: WebhookHandlers = {
  'checkout.session.completed': async (data: Stripe.Event.Data) => {
    console.log('[WEBHOOK] checkout.session.completed')
    // TODO: Add your business logic here
  },
  'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
    console.log('[WEBHOOK] payment_intent.succeeded')
    // TODO: Add your business logic here
  },
  'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) => {
    console.log('[WEBHOOK] payment_intent.payment_failed')
    // TODO: Add your business logic here
  },
  'customer.subscription.deleted': async (data: Stripe.Subscription) => {
    console.log('[WEBHOOK] customer.subscription.deleted')
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer
    const userId = customer.metadata.firebaseUID
    const userRef = db.collection('users').doc(userId)

    await userRef.update({
      activePlans: firestore.FieldValue.arrayRemove(
        data.items.data[0].price.id
      ),
    })
  },
  'customer.subscription.created': async (data: Stripe.Subscription) => {
    console.log('[WEBHOOK] customer.subscription.created')
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer
    const userId = customer.metadata.firebaseUID
    const userRef = db.collection('users').doc(userId)

    await userRef.update({
      activePlans: firestore.FieldValue.arrayUnion(data.items.data[0].price.id),
    })
  },
  'invoice.payment_succeeded': async (data: Stripe.Invoice) => {
    console.log('[WEBHOOK] invoice.payment_succeeded')
    // TODO: Add your business logic here
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer
    const userRef = db.collection('users').doc(customer.metadata.firebaseUID)
    await userRef.update({ status: firestore.FieldValue.delete() })
  },
  'invoice.payment_failed': async (data: Stripe.Invoice) => {
    console.log('[WEBHOOK] invoice.payment_failed')
    // TODO: Add your business logic here
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer
    const userRef = db.collection('users').doc(customer.metadata.firebaseUID)
    await userRef.update({ status: 'PAST_DUE' })
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
