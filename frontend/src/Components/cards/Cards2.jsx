/* eslint-disable react/prop-types */
import React from 'react';

function Cards2({ imgSrc, title, text, buttonText, onClick }) {
  return (
    <div className="col-md-4 col-12 mb-5 worker-card text-center mx-4">
      <div className="card" > 
        <div className="card-body text-center">
          <img
            src={imgSrc}
            className="rounded mb-4"
            height="100" width="90"
            alt={title}
          />
          <h5 className="card-title fw-bold pb-1">{title}</h5>
          <p className="card-text">{text}</p>
          <button
            className="btn btn-light  service-btns"
            onClick={onClick}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cards2;