import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {AiFillStar} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {FaSuitcase} from 'react-icons/fa'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SelectedJobDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetailList: {},
    similarJobList: [],
    skillsList: [],
    LifeAtCompanyList: {},
  }

  componentDidMount() {
    this.getSelectedJobDetails()
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: data.life_at_company,
    description: data.description,
    imageUrl: data.image_url,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    skills: data.skills,
    name: data.name,
    title: data.title,
  })

  getSelectedJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedJobDetails = this.getFormattedData(fetchedData.job_details)
      const updatedSkills = fetchedData.job_details.skills.map(eachSkill =>
        this.getFormattedData(eachSkill),
      )
      const updatedLifeAtCompany = this.getFormattedData(
        fetchedData.job_details.life_at_company,
      )
      const updatedSimilarJobs = fetchedData.similar_jobs.map(eachJob =>
        this.getFormattedData(eachJob),
      )

      console.log(updatedJobDetails)

      this.setState({
        jobDetailList: updatedJobDetails,
        skillsList: updatedSkills,
        LifeAtCompanyList: updatedLifeAtCompany,
        similarJobList: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    }

    if (response.status === 400) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobDetailsView = () => {
    const {
      jobDetailList,
      skillsList,
      LifeAtCompanyList,
      similarJobList,
    } = this.state
    const {
      companyLogoUrl,
      employmentType,
      title,
      id,
      jobDescription,
      companyWebsiteUrl,
      location,
      packagePerAnnum,
      rating,
    } = jobDetailList

    console.log('title')

    return (
      <div className="specific-job-container">
        <div className="selected-job-container">
          <div className="logo-title-rating-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
          <div className="desc-link">
            <h1 className="desc-text">Description</h1>
            <a href={companyWebsiteUrl} className="hyperlink">
              Visit
            </a>
          </div>
          <p className="skill-name">{jobDescription}</p>
          <h1 className="desc-text">Skills</h1>
          <ul className="skills-list">
            {skillsList.map(eachSkill => (
              <li className="skill-item" key={id}>
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-logo"
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="skill-name">Life at company</h1>
          <div className="non-mobile-device">
            <p className="skill-name">{LifeAtCompanyList.description}</p>
            <img
              src={LifeAtCompanyList.imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="skill-name">Similar Jobs</h1>
        <ul className="similar-list">
          {similarJobList.map(eachSimilarJob => (
            <li className="similar-job-item" key={eachSimilarJob.id}>
              <div className="logo-title-rating-container">
                <img
                  src={eachSimilarJob.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div className="company-title-rating-container">
                  <h1 className="title">{eachSimilarJob.title}</h1>
                  <div className="rating-container">
                    <AiFillStar className="star-logo" />
                    <p className="rating">{eachSimilarJob.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="desc-text">Description</h1>
              <p className="description">{jobDescription}</p>
              <div className="location-emp-pack-type-container">
                <div className="container-loc-type">
                  <div className="loc-emp-container">
                    <GoLocation className="icon" />
                    <p className="text">{eachSimilarJob.location}</p>
                  </div>
                  <div className="loc-emp-container">
                    <FaSuitcase className="icon" />
                    <p className="text">{eachSimilarJob.employmentType}</p>
                  </div>
                </div>
                <p className="text">{eachSimilarJob.packagePerAnnum}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onClickSelectedJobRetryJobBtn = () => {
    this.getSelectedJobDetails()
  }

  renderFailurePageView = () => (
    <div className="failure-page">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickSelectedJobRetryJobBtn}
      >
        Retry
      </button>
    </div>
  )

  renderSelectedJobDetails = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailurePageView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="selected-Job-container">
        <Header />
        <div className="job-item-details-container">
          {this.renderSelectedJobDetails()}
        </div>
      </div>
    )
  }
}

export default SelectedJobDetails
