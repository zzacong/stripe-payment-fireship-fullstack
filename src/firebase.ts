import * as firebaseAdmin from 'firebase-admin'

firebaseAdmin.initializeApp()

export const firestore = firebaseAdmin.firestore()
export const auth = firebaseAdmin.auth()
