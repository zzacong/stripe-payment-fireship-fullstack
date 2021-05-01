import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'stripe-payment-bc5fd.firebaseapp.com',
  projectId: 'stripe-payment-bc5fd',
  storageBucket: 'stripe-payment-bc5fd.appspot.com',
  messagingSenderId: '736146536019',
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
}

firebase.initializeApp(firebaseConfig)

export const firestore = firebase.firestore()
export const auth = firebase.auth()
