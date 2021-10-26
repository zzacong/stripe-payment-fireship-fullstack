import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav>
      <ul className="navbar-nav">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/checkout">
            <span aria-label="emoji" role="img">
              🛒
            </span>{' '}
            Checkout
          </Link>
        </li>
        <li>
          <Link to="/payments">
            <span aria-label="emoji" role="img">
              💸
            </span>{' '}
            Payments
          </Link>
        </li>
        <li>
          <Link to="/customers">
            <span aria-label="emoji" role="img">
              🧑🏿‍🤝‍🧑🏻
            </span>{' '}
            Customers
          </Link>
        </li>
        <li>
          <Link to="/subscriptions">
            <span aria-label="emoji" role="img">
              🔄
            </span>{' '}
            Subscriptions
          </Link>
        </li>
      </ul>
    </nav>
  )
}
