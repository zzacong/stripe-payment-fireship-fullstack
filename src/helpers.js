const API_BASE = 'http://localhost:5000'

export async function fetchFromAPI(endpointURL, opts) {
  const { method, body } = { method: 'POST', body: null, ...opts }
  const res = await fetch(`${API_BASE}/${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return res.json()
}
