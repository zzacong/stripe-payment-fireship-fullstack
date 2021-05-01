import { Suspense, useCallback, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useUser, AuthCheck } from 'reactfire'

import { auth, firestore } from '../firebase'
import { fetchFromAPI } from '../helpers'

export default function Customers() {
  return (
    <Suspense fallback={'loading user'}>
      <SaveCard />
    </Suspense>
  )
}

export function SignIn() {
  const signIn = async () => {
    const credential = await auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
    const { uid, email } = credential.user
    firestore.collection('users').doc(uid).set({ email }, { merge: true })
  }

  return (
    <button className="btn btn-primary" onClick={signIn}>
      Sign In with Google
    </button>
  )
}

export function SignOut({ user }) {
  return (
    user && (
      <button
        className="btn btn-outline-secondary"
        onClick={() => auth.signOut()}
      >
        Sign Out | {user.displayName}
      </button>
    )
  )
}

function SaveCard() {
  const stripe = useStripe()
  const elements = useElements()
  const { data: user } = useUser()
  const [setupIntent, setSetupIntent] = useState()
  const [wallet, setWallet] = useState([])

  const getWallet = useCallback(async () => {
    console.log(user)
    if (user) {
      const paymentMethods = await fetchFromAPI('wallet', { method: 'GET' })
      setWallet(paymentMethods)
    }
  }, [user])

  const createSetupIntent = async () => {
    const si = await fetchFromAPI('wallet')
    setSetupIntent(si)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const cardElement = elements.getElement(CardElement)

    // Confirm Card Section
    const {
      setupIntent: updatedSetupIntent,
      error,
    } = await stripe.confirmCardSetup(setupIntent.client_secret, {
      payment_method: { card: cardElement },
    })

    if (error) {
      alert(error.message)
      console.error(error)
    } else {
      setSetupIntent(updatedSetupIntent)
      await getWallet()
      alert('Success! Card added to your wallet')
    }
  }

  useEffect(() => {
    getWallet()
  }, [getWallet])

  return (
    <>
      <AuthCheck fallback={<SignIn />}>
        <div className="well">
          <h3>Step 1: Create a Setup Intent</h3>

          <button
            className="btn btn-success"
            onClick={createSetupIntent}
            hidden={setupIntent}
          >
            Attach New Credit Card
          </button>
        </div>
        <hr />

        <form
          onSubmit={handleSubmit}
          className="well"
          hidden={!setupIntent || setupIntent.status === 'succeeded'}
        >
          <h3>Step 2: Submit a Payment Method</h3>
          <p>Collect credit card details, then attach the payment source.</p>
          <p>
            Normal Card: <code>4242424242424242</code>
          </p>
          <p>
            3D Secure Card: <code>4000002500003155</code>
          </p>

          <hr />

          <CardElement />
          <button className="btn btn-success" type="submit">
            Attach
          </button>
        </form>

        <div className="well">
          <h3>Retrieve all Payment Sources</h3>
          <select className="form-control">
            {wallet.map(paymentSource => (
              <CreditCard key={paymentSource.id} card={paymentSource.card} />
            ))}
          </select>
        </div>

        <div className="well">
          <SignOut user={user} />
        </div>
      </AuthCheck>
    </>
  )
}

function CreditCard({ card }) {
  const { last4, brand, exp_month, exp_year } = card

  return (
    <option>
      {brand} **** **** **** {last4} expires {exp_month}/{exp_year}
    </option>
  )
}
