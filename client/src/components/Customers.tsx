import type { PaymentMethod, SetupIntent } from '@stripe/stripe-js'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useUser, useSigninCheck, useFirestore, useAuth } from 'reactfire'
import { doc, setDoc } from 'firebase/firestore'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { fetchFromAPI } from '../lib/helpers'

export default function Customers() {
  return (
    <Suspense fallback={'loading user'}>
      <SaveCard />
    </Suspense>
  )
}

export function SignIn() {
  const auth = useAuth()
  const db = useFirestore()

  const signIn = async () => {
    const credential = await signInWithPopup(auth, new GoogleAuthProvider())
    const { uid, email } = credential.user
    setDoc(doc(db, 'users', uid), { email }, { merge: true })
  }

  return (
    <button className="btn btn-primary" onClick={signIn}>
      Sign In with Google
    </button>
  )
}

export function SignOut() {
  const auth = useAuth()
  const { data: user } = useUser()

  if (!user) return null
  return (
    <button
      className="btn btn-outline-secondary"
      onClick={() => auth.signOut()}
    >
      Sign Out | {user.displayName}
    </button>
  )
}

function SaveCard() {
  const stripe = useStripe()
  const elements = useElements()

  const { data: signInCheckResult } = useSigninCheck()

  const [setupIntent, setSetupIntent] = useState<SetupIntent>()
  const [wallet, setWallet] = useState<PaymentMethod[]>([])

  const getWallet = useCallback(async () => {
    if (signInCheckResult.signedIn) {
      const paymentMethods = await fetchFromAPI('wallet', { method: 'GET' })
      setWallet(paymentMethods)
    }
  }, [signInCheckResult.signedIn])

  const createSetupIntent = async () => {
    const si = await fetchFromAPI('wallet')
    setSetupIntent(si)
  }

  const handleSubmit: React.FormEventHandler = async e => {
    e.preventDefault()
    if (!elements || !stripe) return
    const cardElement = elements.getElement(CardElement)!

    // Confirm Card Section
    const { setupIntent: updatedSetupIntent, error } =
      await stripe.confirmCardSetup(setupIntent?.client_secret!, {
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

  if (!signInCheckResult.signedIn) return <SignIn />

  return (
    <>
      <div className="well">
        <h3>Step 1: Create a Setup Intent</h3>

        <button
          className="btn btn-success"
          onClick={createSetupIntent}
          // hidden={!!setupIntent}
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
          {wallet.map(paymentSource =>
            paymentSource.card ? (
              <CreditCard key={paymentSource.id} card={paymentSource.card} />
            ) : null
          )}
        </select>
      </div>

      <div className="well">
        <SignOut />
      </div>
    </>
  )
}

function CreditCard({ card }: { card: PaymentMethod.Card }) {
  const { last4, brand, exp_month, exp_year } = card

  return (
    <option>
      {brand} **** **** **** {last4} expires {exp_month}/{exp_year}
    </option>
  )
}
