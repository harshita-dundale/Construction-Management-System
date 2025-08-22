
/* eslint-disable react/prop-types */
function Cards1({ imgSrc, title, text, buttonText, onClick }) {  
  return (
    <div className="col-md-3 col-sm-6 text-dark">
      <div className="card h-100 d-flex flex-column">
        <div className="card-body flex-grow-1">
          <img src={imgSrc} className="rounded mb-3 icons" width="60" height="60" alt={title} />
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{text}</p>
          <div className="card-footer border-0 bg-transparent text-center">
            <button className="btn btn-light service-btns" onClick={onClick}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cards1;