import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BiSearchAlt2} from 'react-icons/bi'
import FiltersGroup from '../FiltersGroup'
import RadioFilters from '../RadioFilters'
import JobDetails from '../JobDetails'
import Header from '../Header'

import './index.css'

const initialEmploymentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
    isChecked: false,
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
    isChecked: false,
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
    isChecked: false,
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
    isChecked: false,
  },
]

const initialSalaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
    isCheckedRadio: false,
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
    isCheckedRadio: false,
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
    isCheckedRadio: false,
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
    isCheckedRadio: false,
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const apiStatusProfileConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    employmentTypesList: initialEmploymentTypesList,
    apiProfileStatus: apiStatusProfileConstants.initial,
    salaryTypesList: initialSalaryRangesList,
    profileDetails: [],
    salaryRangeList: [],
    jobsList: [],
    searchInput: '',
    searchJob: '',
    empSearchTypeList: [],
  }

  componentDidMount() {
    this.getJobsList()
    this.getProfileDetails()
  }

  getJobsList = async () => {
    const {
      searchJob,
      employmentTypesList,
      salaryRangeList,
      salaryTypesList,
      empSearchTypeList,
    } = this.state

    this.setState({empSearchTypeList: []})
    this.setState({salaryRangeList: []})

    const filteredEmpList = employmentTypesList.filter(
      eachEmpType => eachEmpType.isChecked === true,
    )

    const filteredSalaryRangeList = salaryTypesList.filter(
      eachRangeType => eachRangeType.isCheckedRadio === true,
    )

    filteredEmpList.forEach(eachItem =>
      empSearchTypeList.push(eachItem.employmentTypeId),
    )

    filteredSalaryRangeList.forEach(eachItem =>
      salaryRangeList.push(eachItem.salaryRangeId),
    )

    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${empSearchTypeList.join()}&minimum_package=${salaryRangeList.join()}&search=${searchJob}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedJobsData = await response.json()
      const updatedJobsData = fetchedJobsData.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsList: updatedJobsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 400) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getFormattedData = data => ({
    name: data.name,
    profileImageUrl: data.profile_image_url,
    shortBio: data.short_bio,
  })

  getProfileDetails = async () => {
    const profileUrl = 'https://apis.ccbp.in/profile'

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    this.setState({apiProfileStatus: apiStatusProfileConstants.inProgress})

    const response = await fetch(profileUrl, options)
    console.log(response)
    if (response.ok === true) {
      const fetchedProfile = await response.json()
      const updatedProfileDetails = this.getFormattedData(
        fetchedProfile.profile_details,
      )
      this.setState({
        profileDetails: updatedProfileDetails,
        apiProfileStatus: apiStatusProfileConstants.success,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiProfileStatus: apiStatusProfileConstants.failure,
      })
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchInput = () => {
    const {searchInput} = this.state
    this.setState({searchJob: searchInput}, this.getJobsList)
  }

  renderLoaderView = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSearchInput = () => {
    const {searchInput} = this.state
    return (
      <div className="search-input-container">
        <input
          type="search"
          value={searchInput}
          className="search-input"
          placeholder="search"
          onChange={this.onChangeSearchInput}
        />
        <button
          type="button"
          className="search-button"
          testid="searchButton"
          onClick={this.onClickSearchInput}
        >
          <BiSearchAlt2 className="search-icon" />
        </button>
      </div>
    )
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    const isSearchedFound = jobsList.length > 0
    return isSearchedFound ? (
      <ul className="jobs-datalist">
        {jobsList.map(eachJob => (
          <JobDetails eachJob={eachJob} key={eachJob.id} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-image"
        />
        <h1 className="no-jobs">No Jobs Found</h1>
        <p className="no-jobs desc">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

  onFilterRadio = id => {
    console.log(id)
    this.setState(
      prevState => ({
        salaryTypesList: prevState.salaryTypesList.map(eachSalaryType => {
          if (id === eachSalaryType.salaryRangeId) {
            return {
              ...eachSalaryType,
              isCheckedRadio: !eachSalaryType.isCheckedRadio,
            }
          }
          return eachSalaryType
        }),
      }),
      this.getJobsList,
    )
  }

  renderSalaryRangesView = () => {
    const {salaryTypesList} = this.state
    return (
      <div className="employment-type-container">
        <hr className="horizontal-line" />
        <h1 className="desc">Salary Range</h1>
        <ul className="emp-type-list">
          {salaryTypesList.map(eachSalaryRange => (
            <RadioFilters
              eachSalaryRange={eachSalaryRange}
              key={eachSalaryRange.salaryRangeId}
              onFilterRadio={this.onFilterRadio}
            />
          ))}
        </ul>
      </div>
    )
  }

  onFilterCheckbox = id => {
    this.setState(
      prevState => ({
        employmentTypesList: prevState.employmentTypesList.map(eachEmpType => {
          if (id === eachEmpType.employmentTypeId) {
            return {...eachEmpType, isChecked: !eachEmpType.isChecked}
          }
          return eachEmpType
        }),
      }),
      this.getJobsList,
    )
  }

  renderEmploymentTypeView = () => {
    const {employmentTypesList} = this.state
    return (
      <div className="employment-type-container">
        <hr className="horizontal-line" />
        <h1 className="desc">Type of Employment</h1>
        <ul className="emp-type-list">
          {employmentTypesList.map(eachEmpType => (
            <FiltersGroup
              eachEmpType={eachEmpType}
              key={eachEmpType.employmentTypeId}
              onFilterCheckbox={this.onFilterCheckbox}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProfileDetailsView = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-bg-container">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-image"
        />
        <h1 className="profile-name">{profileDetails.name}</h1>
        <p className="profile-bio">{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderJobsDataView = () => (
    <div className="jobs-data-container">
      <Header />
      <div className="non-mobile-view-container">
        <div className="mobile-view-search">{this.renderSearchInput()}</div>
        <div className="non-mobile-view-filters">
          {this.renderProfileDetails()}
          {this.renderEmploymentTypeView()}
          {this.renderSalaryRangesView()}
        </div>
        <div className="non-mobile-search-jobs-view">
          {this.renderSearchInput()}
          {this.renderJobsList()}
        </div>
      </div>
    </div>
  )

  onClickRetryJobBtn = () => {
    this.getJobsList()
  }

  onClickProfileRetryJobBtn = () => {
    this.getProfileDetails()
  }

  renderFailureView = () => (
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
        onClick={this.onClickRetryJobBtn}
      >
        Retry
      </button>
    </div>
  )

  renderProfileFailureView = () => (
    <div className="profile-error-container">
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickProfileRetryJobBtn}
      >
        Retry
      </button>
    </div>
  )

  renderProfileDetails = () => {
    const {apiProfileStatus} = this.state

    switch (apiProfileStatus) {
      case apiStatusProfileConstants.success:
        return this.renderProfileDetailsView()
      case apiStatusProfileConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusProfileConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  renderJobsDataPage = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsDataView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return <div className="Jobs-container">{this.renderJobsDataPage()}</div>
  }
}

export default Jobs

/*
  getProfileDetails = async () => {
    const profileUrl = 'https://apis.ccbp.in/profile'

    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileUrl, options)
    const fetchedProfile = await response.json()
    const updatedProfileDetails = fetchedProfile.profile_details

    console.log(updatedProfileDetails)
    this.setState({profileDetails: updatedProfileDetails})
  }
*/

/*
   
    */

/*
  renderEmploymentTypeView = () => (
    <div className="employment-type-container">
      <hr className="horizontal-line" />
      <p className="desc">Type of Employment</p>
      <ul className="emp-type-list">
        {employmentTypesList.map(eachEmpType => (
          <FiltersGroup
            eachEmpType={eachEmpType}
            key={eachEmpType.employmentTypeId}
          />
        ))}
      </ul>
    </div>
  )
*/
