import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'stripe-payment-bc5fd.firebaseapp.com',
  projectId: 'stripe-payment-bc5fd',
  storageBucket: 'stripe-payment-bc5fd.appspot.com',
  messagingSenderId: '736146536019',
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
