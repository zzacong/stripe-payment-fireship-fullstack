import * as firebaseAdmin from 'firebase-admin'
import * as fs from 'fs'

const servicePath = process.env.GOOGLE_APPLICATION_CREDENTIALS as string
if (!fs.existsSync(servicePath)) {
  const cred = JSON.parse(process.env.FIREBASE_SERVICE_CRED as string)
  fs.writeFileSync(servicePath, JSON.stringify(cred, null, 2), {
    encoding: 'utf-8',
  })
}

firebaseAdmin.initializeApp()

export const db = firebaseAdmin.firestore()
export const auth = firebaseAdmin.auth()
