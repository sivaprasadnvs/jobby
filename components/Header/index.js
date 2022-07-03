import {AiFillHome} from 'react-icons/ai'
import {BsBagFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'

import {Link, withRouter} from 'react-router-dom'

import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="web-logo"
          />
        </Link>
        <ul className="home-jobs-container">
          <div className="list-items">
            <li>
              <Link to="/" className="item">
                Home
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="item">
                Jobs
              </Link>
            </li>
          </div>
          <button type="button" className="logout-btn" onClick={onClickLogout}>
            Logout
          </button>
        </ul>
        <ul className="nav-menu">
          <li>
            <Link to="/">
              <AiFillHome className="home-logo" />
            </Link>
          </li>
          <li>
            <Link to="/jobs">
              <BsBagFill className="home-logo" />
            </Link>
          </li>
          <li onClick={onClickLogout}>
            <Link to="/login">
              <FiLogOut className="home-logo" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default withRouter(Header)
