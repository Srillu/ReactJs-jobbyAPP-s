import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import Loader from 'react-loader-spinner'

import JobItemDetailsRoute from '../JobItemDetailsRoute'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobsRoute extends Component {
  state = {
    jobsList: [],
    profileList: [],
    apiStatus: apiConstants.initial,
    jobsApiStatus: apiConstants.initial,
    employeeType: '',
    expectedSalary: '',
    inputValue: '',
  }

  componentDidMount() {
    this.getJobs()
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({jobsApiStatus: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedProfileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileList: updatedProfileDetails,
        jobsApiStatus: apiConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiConstants.failure})
    }
  }

  retryButton = () => this.getProfile()

  renderProfileFailureView = () => (
    <button className="retry-button" type="button" onClick={this.retryButton}>
      Retry
    </button>
  )

  jobProfileOnSuccess = () => {
    const {profileList} = this.state
    const {name, profileImageUrl, shortBio} = profileList
    return (
      <div className="profile-details-container">
        <img alt={name} src={profileImageUrl} />
        <p className="profile-name">{name}</p>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderProfileBasedOnApi = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.jobProfileOnSuccess()
      case apiConstants.failure:
        return this.renderProfileFailureView()

      default:
        return null
    }
  }

  getJobs = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {employeeType, expectedSalary, inputValue} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeType}&minimum_package=${expectedSalary}&search=${inputValue}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  searchInput = () => {
    this.getJobs()
  }

  onChangeSearchInput = event => {
    this.setState({inputValue: event.target.value})
  }

  onChangeEmployee = event => {
    console.log(event.target.value)
    this.setState({employeeType: event.target.value})
  }

  onChangeSalary = event => {
    console.log(event.target.value)
    this.setState({expectedSalary: event.target.value})
  }

  renderTypeOfEmployment = () => {
    const {employeeType} = this.state
    return (
      <ul className="type-employment-container">
        <h1 className="heading">Type of Employment</h1>
        {employmentTypesList.map(eachItem => (
          <li key={eachItem.employmentTypeId}>
            <input
              type="checkbox"
              id={eachItem.employmentTypeId}
              value={eachItem.employmentTypeId}
              onChange={this.onChangeEmployee}
              name={eachItem.employmentTypeId}
            />
            <label htmlFor={eachItem.employmentTypeId}>{eachItem.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  renderSalaryRangesList = () => (
    <ul className="type-employment-container">
      <h1 className="heading">Salary Range</h1>
      {salaryRangesList.map(eachItem => (
        <li key={eachItem.salaryRangeId}>
          <input
            onChange={this.onChangeSalary}
            type="radio"
            id={eachItem.salaryRangeId}
            value={eachItem.label}
            name="radioBox"
          />
          <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  renderBasedOnApi = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  onClickRetryJobsButton = () => {
    this.getJobs()
  }

  renderFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <p>Oops! Something Went Wrong</p>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetryJobsButton}>
        Retry
      </button>
    </div>
  )

  noJobsView = () => (
    <div className="no-jobs-container">
      <img
        className="no-jobs"
        alt="no jobs"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-para">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderSuccessView = () => {
    const {jobsList} = this.state
    const isShowJobsList = jobsList.length > 0

    return isShowJobsList ? (
      <ul className="jobs-list">
        {jobsList.map(jobs => (
          <JobItemDetailsRoute jobItems={jobs} key={jobs.id} />
        ))}
      </ul>
    ) : (
      this.noJobsView()
    )
  }

  renderJobsList = () => {
    const {inputValue} = this.state
    return (
      <>
        <div className="job-container">
          <div>
            {this.renderProfileBasedOnApi()}
            <hr />
            <div className="profile-container">
              {this.renderTypeOfEmployment()}
              <hr />
              {this.renderSalaryRangesList()}
            </div>
          </div>
          <div>
            <div className="search-input-container">
              <input
                type="search"
                className="input-box"
                placeholder="search"
                onChange={this.onChangeSearchInput}
                value={inputValue}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-icon-button"
                onClick={this.searchInput}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderBasedOnApi()}
          </div>
        </div>
      </>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    return (
      <>
        <div className="job-bg-container">
          <Header />
          {this.renderJobsList()}
        </div>
      </>
    )
  }
}

export default JobsRoute
