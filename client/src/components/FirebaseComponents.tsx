import { useMemo } from 'react'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { FirestoreProvider, AuthProvider, useFirebaseApp } from 'reactfire'

let count = 0

export default function FirebaseComponents({
  children,
}: React.PropsWithChildren<unknown>) {
  const app = useFirebaseApp() // a parent component contains a `FirebaseAppProvider`

  // initialize Database and Auth with the normal Firebase SDK functions
  const db = useMemo(() => getFirestore(app), [])
  const auth = useMemo(() => getAuth(app), [])

  console.log('rerender', ++count)

  // any child components will be able to use `useUser`, `useDatabaseObjectData`, etc
  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={db}>{children}</FirestoreProvider>
    </AuthProvider>
  )
}
