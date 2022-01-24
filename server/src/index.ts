import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
})

async function main() {
  const { app } = await import('./api')

  const port = process.env.PORT || 5000

  app.listen(port, () =>
    console.log(`API available on http://localhost:${port}`)
  )
}

main().catch(console.error)
