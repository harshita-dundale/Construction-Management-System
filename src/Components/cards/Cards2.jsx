/* eslint-disable react/prop-types */
function Cards2({ imgSrc, title, text, buttonText }) {
  return (
    <div className="col-md-5 col-sm-6 mb-4 worker-card">
      <div className="card h-100">
        <div className="card-body text-center">
          <img src={imgSrc} className="rounded mb-3 icons" width="60" height="60" alt={title} />
          <h5 className={title}>Browse and Apply for Jobs</h5>
          <p className="card-text">{text}</p>
          <button className="btn btn-light rounded-pill service-btns">{buttonText} </button>
        </div>
      </div>
    </div>
  )
}

export default Cards2;