import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'stripe-payment-bc5fd.firebaseapp.com',
  projectId: 'stripe-payment-bc5fd',
  storageBucket: 'stripe-payment-bc5fd.appspot.com',
  messagingSenderId: '736146536019',
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()
export const auth = firebase.auth()
