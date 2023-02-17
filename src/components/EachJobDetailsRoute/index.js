import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp, IoBagRemoveSharp} from 'react-icons/io5'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class EachJobDetailsRoute extends Component {
  state = {
    jobDetails: {},
    similarJobsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobDetailsApiUrl, options)
    const fetchedData = await response.json()

    console.log(fetchedData)
    if (response.ok === true) {
      const data = fetchedData.job_details
      const jobItemDetails = {
        id: data.id,
        companyLogoUrl: data.company_logo_url,
        companyWebsiteUrl: data.company_website_url,
        employmentType: data.employment_type,
        jobDescription: data.job_description,
        imageUrl: data.life_at_company.image_url,
        description: data.life_at_company.description,
        location: data.location,
        packagePerAnnum: data.package_per_annum,
        rating: data.rating,
        skills: data.skills.map(eachItem => ({
          name: eachItem.name,
          imageUrl: eachItem.image_url,
        })),
        title: data.title,
      }

      const similarJobsListItems = fetchedData.similar_jobs.map(eachItem => ({
        id: eachItem.id,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      console.log(fetchedData.similar_jobs)
      this.setState({
        jobDetails: jobItemDetails,
        similarJobsList: similarJobsListItems,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retryJobItemDetails = () => this.getJobDetails()

  renderFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        onClick={this.retryJobItemDetails()}
        className="btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderBasedOnApis = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderOnSuccess()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  renderSimilarJobs = () => {
    const {similarJobsList} = this.state
    // const itemStrings = similarJobsList.join(', ')
    return (
      <ul className="similar-jobs-container">
        {similarJobsList.map(eachItem => (
          <li key={eachItem.id} className="each-job-list-item">
            <div className="logo-container">
              <img
                alt="company logo"
                className="company-logo"
                src={eachItem.companyLogoUrl}
              />
              <div>
                <h1 className="title-heading">{eachItem.title}</h1>
                <div className="star-container">
                  <AiFillStar className="star-icon" />
                  <p className="rating">{eachItem.rating}</p>
                </div>
              </div>
            </div>

            <h1 className="description">Description</h1>
            <p className="description-paragraph">{eachItem.jobDescription}</p>
            <div className="middle-wise-container">
              <div className="middle-container">
                <IoLocationSharp className="location-icon" />
                <p className="rating">{eachItem.location}</p>
              </div>

              <div className="middle-container">
                <IoBagRemoveSharp className="location-icon" />
                <p className="rating">{eachItem.employmentType}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  //   renderSkills = () => {
  //     const {jobDetails} = this.state
  //     const {skills} = jobDetails
  //     return (
  //       <ul className="skill-ul-container">
  //         {skills.map(eachItem => (
  //           <li key={eachItem.name} className="skills-container">
  //             <img alt={eachItem.name} src={eachItem.imageUrl} />
  //             <div>
  //               <p>{eachItem.name} </p>
  //             </div>
  //           </li>
  //         ))}
  //       </ul>
  //     )
  //   }

  renderOnSuccess = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      imageUrl,
      description,
    } = jobDetails
    return (
      <div>
        <ul>
          <li className="each-job-details-card">
            <div className="logo-container">
              <img
                alt="job details company logo"
                className="company-logo"
                src={companyLogoUrl}
              />
              <div>
                <h1 className="title-heading">{title}</h1>
                <div className="star-container">
                  <AiFillStar className="star-icon" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="middle-wise1-container">
              <div className="item">
                <div className="middle-container">
                  <IoLocationSharp className="location-icon" />
                  <p className="rating">{location}</p>
                </div>

                <div className="middle-container">
                  <IoBagRemoveSharp className="location-icon" />
                  <p className="rating">{employmentType}</p>
                </div>
              </div>
              <div className="package">
                <p>{packagePerAnnum}</p>
              </div>
            </div>
            <hr className="line" />
            <div className="description-visit-container">
              <h1 className="description">Description</h1>
              <a
                className="anchor-cont"
                rel="noreferrer"
                target="_blank"
                href={companyWebsiteUrl}
              >
                <p className="visit-icon">Visit </p>
                <BiLinkExternal className="visiting-icon" />
              </a>
            </div>
            <p className="description-paragraph">{jobDescription}</p>
            <h1 className="description">Skills </h1>
            {/* <div>{this.renderSkills()}</div> */}

            <h1 className="description">Life at Company </h1>
            <div className="life-at-container">
              <p className="para">{description}</p>
              <img alt="life at company" src={imageUrl} />
            </div>
          </li>
        </ul>
        <div>
          <h1 className="similar-description">Similar Jobs </h1>
          {this.renderSimilarJobs()}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="each-Item-container">
        <Header />
        {this.renderBasedOnApis()}
      </div>
    )
  }
}
export default EachJobDetailsRoute
