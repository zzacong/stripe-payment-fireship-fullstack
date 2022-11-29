import React from 'react'
import ReactDOM from 'react-dom/client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { FirebaseAppProvider } from 'reactfire'

import { firebaseConfig } from './lib/firebase'
import FirebaseComponents from './components/FirebaseComponents'

import App from './App'
import './index.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense>
      <FirebaseComponents>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </FirebaseComponents>
    </FirebaseAppProvider>
  </React.StrictMode>
)
