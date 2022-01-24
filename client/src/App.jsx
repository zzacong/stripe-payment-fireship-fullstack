import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Checkout, { CheckoutSuccess, CheckoutFail } from './components/Checkout'
import Customers from './components/Customers'
import Navbar from './components/Navbar'
import Payments from './components/Payments'
import Subscriptions from './components/Subscriptions'

export default function App() {
  return (
    <Router>
      <div>
        <Navbar />

        <main>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/checkout">
              <Checkout />
            </Route>
            <Route path="/payments">
              <Payments />
            </Route>
            <Route path="/customers">
              <Customers />
            </Route>
            <Route path="/subscriptions">
              <Subscriptions />
            </Route>
            <Route path="/success">
              <CheckoutSuccess />
            </Route>
            <Route path="/failed">
              <CheckoutFail />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
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
