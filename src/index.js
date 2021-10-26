import React from 'react'
import ReactDOM from 'react-dom'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { FirebaseAppProvider } from 'reactfire'
import './index.css'
import App from './App'
import { firebaseConfig } from './firebase'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
