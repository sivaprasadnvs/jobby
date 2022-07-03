import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div className="home-app-container">
      <Header />
      <div className="home-container">
        <h1 className="home-title">Find The Job That Fits Your Life</h1>
        <p className="home-sub-title">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the jobs that fits your abilities and potential
        </p>

        <Link to="/jobs" className="item-link">
          <button type="button" className="home-btn">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home
