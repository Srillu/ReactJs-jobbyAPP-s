import {Link} from 'react-router-dom'

import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp, IoBagRemoveSharp} from 'react-icons/io5'

import './index.css'

const JobItemDetailsRoute = props => {
  const {jobItems} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobItems

  return (
    <li className="each-job-card">
      <Link className="link-item" to={`/jobs/${id}`}>
        <div className="logo-container">
          <img
            alt="company logo"
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
        <div className="middle-wise-container">
          <div className="middle-container">
            <IoLocationSharp className="location-icon" />
            <p className="rating">{location}</p>
          </div>

          <div className="middle-container">
            <IoBagRemoveSharp className="location-icon" />
            <p className="rating">{employmentType}</p>
          </div>
          <div className="package">
            <p>{packagePerAnnum}</p>
          </div>
        </div>
        <hr className="line" />
        <h1 className="description">Description</h1>
        <p className="description-paragraph">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItemDetailsRoute
