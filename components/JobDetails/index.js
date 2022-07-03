import {Link} from 'react-router-dom'
import './index.css'
import {AiFillStar} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {FaSuitcase} from 'react-icons/fa'

const JobDetails = props => {
  const {eachJob} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = eachJob
  return (
    <li className="jobDetailsContainer">
      <Link to={`/jobs/${id}`} className="item-link">
        <div className="logo-title-rating-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="company-title-rating-container">
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="star-logo" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-emp-pack-type-container">
          <div className="container-loc-type">
            <div className="loc-emp-container">
              <GoLocation className="icon" />
              <p className="text">{location}</p>
            </div>
            <div className="loc-emp-container">
              <FaSuitcase className="icon" />
              <p className="text">{employmentType}</p>
            </div>
          </div>
          <p className="text">{packagePerAnnum}</p>
        </div>
        <hr className="horizontal-line" />
        <h1 className="desc-text">Description</h1>
        <p className="description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobDetails
