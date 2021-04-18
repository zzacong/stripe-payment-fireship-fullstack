import { config } from 'dotenv'
import Stripe from 'stripe'

if (process.env.NODE_ENV !== 'production') config()

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
})

import { app } from './api'
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`API available on http://localhost:${port}`))
