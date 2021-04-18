import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Checkout, CheckoutSuccess, CheckoutFail } from './Checkout'
import Customers from './components/Customers'
import Navbar from './components/Navbar'
import Payments from './components/Payments'
import Subscriptions from './components/Subscriptions'

function App() {
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
      <div class="well">
        <h2>Stripe React + Node.js Live Demo</h2>
      </div>

      <div class="embed-responsive embed-responsive-16by9 vid">
        <iframe
          src="https://player.vimeo.com/video/416381401"
          // width="640"
          // height="360"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
      </div>

      <div class="well">
        <h2>Running in Test Mode</h2>
        <p>
          This demo is running in Stripe test mode, so feel free to submit
          payments with testing cards.
        </p>
        <a
          class="btn btn-outline-success"
          href="https://fireship.io/courses/stripe-js"
        >
          Full Stripe JS Course
        </a>
        <a
          class="btn btn-secondary"
          href="https://github.com/fireship-io/stripe-payments-js-course"
        >
          source code
        </a>
      </div>
    </>
  )
}

export default App
