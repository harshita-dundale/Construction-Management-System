import React from 'react';
function Card3({ application }) {
  return (
    <div className="container border-bottom pb-4 mb-4">
      <div className="row">
        <div className='col-md-6'>
          <h3>{application.name}</h3>
          <p>Applied on: {application.appliedDate}</p> 
          <p>Experience: {application.experience} years</p>
          <p>Skills: {application.skills.join(", ")}</p>
        </div>
        <div className=" col-md-6 d-flex justify-content-end align-items-center">
          {/*actions d-flex flex-column flex-sm-row justify-content-end  justify-content-between align-items-center  Buttons will stack vertically on small devices and be inline on larger screens */}
          <button className="btn btn-success mb-2 mb-sm-0 me-sm-2">Accept</button>
          <button className="btn btn-danger mb-2 mb-sm-0 me-sm-2"> Reject</button>
        </div>
      </div>
    </div>
  );
}

export default Card3;
