import { Request, Response } from 'express'
import Stripe from 'stripe'

export type MyContext = {
  req: Request & { rawBody: any }
  res: Response
}

type Fn = (data: Stripe.PaymentIntent) => void

interface IObjectKeys {
  [key: string]: any
}

export interface WebhookHandlers extends IObjectKeys {
  'payment_intent.succeeded': Fn
  'payment_intent.payment_failed': Fn
}
