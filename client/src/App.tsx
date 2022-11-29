import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import { CheckoutSuccess, CheckoutFail } from './components/Checkout'

const Checkout = lazy(() => import('./components/Checkout'))
const Customers = lazy(() => import('./components/Customers'))
const Payments = lazy(() => import('./components/Payments'))
const Subscriptions = lazy(() => import('./components/Subscriptions'))

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <div>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/success" element={<CheckoutSuccess />} />
              <Route path="/failed" element={<CheckoutFail />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </Suspense>
  )
}

function Home() {
  return (
    <>
      <div className="well">
        <h2>Stripe React + Node.js Live Demo</h2>
      </div>

      <div className="embed-responsive embed-responsive-16by9 vid">
        <iframe
          title="Fireship.io Stripe Course"
          src="https://player.vimeo.com/video/416381401"
          // width="640"
          // height="360"
          frameBorder="0"
          allow="autoplay; fullscreen"
        ></iframe>
      </div>

      <div className="well">
        <h2>Running in Test Mode</h2>
        <p>
          This demo is running in Stripe test mode, so feel free to submit
          payments with testing cards.
        </p>
        <a
          className="btn btn-outline-success"
          href="https://fireship.io/courses/stripe-js"
        >
          Full Stripe JS Course
        </a>
        <a
          className="btn btn-secondary"
          href="https://github.com/zzacong/stripe-payment-fireship-fullstack/tree/main/client"
        >
          source code
        </a>
      </div>
    </>
  )
}
