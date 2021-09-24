import { auth } from 'firebase-admin'
import Stripe from 'stripe'

type Fn = (data: Stripe.PaymentIntent) => void

interface IObjectKeys {
  [key: string]: any
}

interface WebhookHandlers extends IObjectKeys {
  'payment_intent.succeeded': Fn
  'payment_intent.payment_failed': Fn
}

declare global {
  interface WebhookHandlers extends IObjectKeys {
    'payment_intent.succeeded': Fn
    'payment_intent.payment_failed': Fn
  }
  
  namespace Express {
    interface Request {
      rawBody: Buffer
      currentUser?: auth.DecodedIdToken
    }
  }
}
