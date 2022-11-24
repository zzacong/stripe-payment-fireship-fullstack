import { auth } from '../firebase'

const API_BASE = import.meta.env.VITE_SERVER_URL

export async function fetchFromAPI(endpointURL, opts) {
  const { method, body } = { method: 'POST', body: null, ...opts }

  const user = auth.currentUser
  const token = user && (await user.getIdToken(false))

  const res = await fetch(`${API_BASE}/${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return res.json()
}
