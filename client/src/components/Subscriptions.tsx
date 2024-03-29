import type Stripe from 'stripe'
import type { User } from 'firebase/auth'

import { Suspense, useState, useCallback, useEffect } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { doc } from 'firebase/firestore'
import {
  useUser,
  useFirestore,
  useFirestoreDocData,
  useSigninCheck,
} from 'reactfire'

import { fetchFromAPI } from '../lib/helpers'
import { SignIn, SignOut } from './Customers'

// !! Subscriptions
export default function Subscriptions() {
  return (
    <Suspense fallback={'loading user'}>
      <SubscribeToPlan />
    </Suspense>
  )
}

// !! UserData
function UserData({ user }: { user: User }) {
  const db = useFirestore()
  const userRef = doc(db, 'users', user.uid)
  // Subscribe to the user's data in Firestore
  const { status, data } = useFirestoreDocData(userRef)

  if (status === 'loading') return null

  return (
    <pre>
      Stripe Customer ID: {data.stripeCustomerId} <br />
      Subscriptions: {JSON.stringify(data.activePlans || [])}
    </pre>
  )
}

// !! SubscribeToPlan
function SubscribeToPlan() {
  const stripe = useStripe()
  const elements = useElements()

  const { data: user } = useUser()
  const { data: signInCheckResult } = useSigninCheck()

  const [plan, setPlan] = useState<string>()
  const [subscriptions, setSubscriptions] = useState<Stripe.Subscription[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch current subscriptions from the API
  const getSubscriptions = useCallback(async () => {
    const subs = await fetchFromAPI('subscriptions', { method: 'GET' })
    setSubscriptions(subs)
  }, [])

  // Cancel a subscription
  const cancel = async (id: string) => {
    setLoading(true)
    await fetchFromAPI(`subscriptions/${id}`, { method: 'PATCH' })
    alert('canceled!')
    await getSubscriptions()
    setLoading(false)
  }

  // Handle the submission of card details
  const handleSubmit: React.FormEventHandler = async e => {
    e.preventDefault()
    if (!elements || !stripe) return
    setLoading(true)
    const cardElement = elements.getElement(CardElement)!

    // Create Payment Method
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    // Create Subscription on the Server
    const subscription = await fetchFromAPI('subscriptions', {
      body: {
        plan,
        payment_method: paymentMethod.id,
      },
    })

    // The subscription contains an invoice
    // If the invoice's payment succeeded then you're good,
    // otherwise, the payment intent must be confirmed
    const { latest_invoice } = subscription

    if (latest_invoice.payment_intent) {
      const { client_secret, status } = latest_invoice.payment_intent

      if (status === 'requires_action') {
        const { error: confirmationError } = await stripe.confirmCardPayment(
          client_secret
        )
        if (confirmationError) {
          console.error(confirmationError)
          return alert('unable to confirm card')
        }
      }
      // success
      alert('You are subscribed!')
      getSubscriptions()
    }
    setLoading(false)
    setPlan(undefined)
  }

  useEffect(() => {
    if (user) {
      getSubscriptions()
    }
  }, [user, getSubscriptions])

  return (
    <>
      <h2>Subscriptions</h2>
      <p>
        Subscribe a user to a recurring plan, process the payment, and sync with
        Firestore in realtime.
      </p>

      {signInCheckResult.signedIn ? (
        <>
          <div className="well">
            <h2>Firestore Data</h2>
            <p>User's data in Firestore.</p>
            {user?.uid && <UserData user={user} />}
          </div>

          <div className="well">
            <h3>Step 1: Choose a Plan</h3>

            <button
              className={
                'btn ' +
                (plan === 'plan_HC2o83JbeowZnP'
                  ? 'btn-primary'
                  : 'btn-outline-primary')
              }
              onClick={() => setPlan('price_1ImGWPBQMKATlOQtEdXLha9N')}
            >
              Choose Monthly $25/m
            </button>

            <button
              className={
                'btn ' +
                (plan === 'plan_HD6rlaovzAiM7B'
                  ? 'btn-primary'
                  : 'btn-outline-primary')
              }
              onClick={() => setPlan('price_1ImGWwBQMKATlOQtZguUIdKL')}
            >
              Choose Quarterly $50/q
            </button>

            <p>
              Selected Plan: <strong>{plan}</strong>
            </p>
          </div>
          <hr />

          <form onSubmit={handleSubmit} className="well" hidden={!plan}>
            <h3>Step 2: Submit a Payment Method</h3>
            <p>Collect credit card details</p>
            <p>
              Normal Card: <code>4242424242424242</code>
            </p>
            <p>
              3D Secure Card: <code>4000002500003155</code>
            </p>

            <hr />

            <CardElement />
            <button
              className="btn btn-success"
              type="submit"
              disabled={loading}
            >
              Subscribe & Pay
            </button>
          </form>

          <div className="well">
            <h3>Manage Current Subscriptions</h3>
            <div>
              {subscriptions.map(sub => (
                <div
                  key={sub.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span className="text-left">
                    {sub.id}. Next payment of $
                    {(sub.items.data[0]?.plan.amount! / 100).toFixed(2)} due{' '}
                    {new Date(sub.current_period_end * 1000).toUTCString()}
                  </span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => cancel(sub.id)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="well">
            <SignOut />
          </div>
        </>
      ) : (
        <SignIn />
      )}
    </>
  )
}
