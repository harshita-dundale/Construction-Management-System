function Card3({ application }) {
  return (
    <div className="card shadow-sm mb-4 h-100 d-flex flex-column text-center ">
      <div className="card-body flex-grow-1" style={{ backgroundColor: "rgb(226, 236, 234)" }}>
        <h5 className="card-title">{application.name}</h5>
        <p className="card-text">Applied on: {application.appliedDate || new Date().toISOString().slice(0, 10)}</p>

        <p className="card-text">Experience: {application.experience} years</p>
        {/* <p className="card-text">Skills: {application.skills.join(", ")}</p> */}
<p className="card-text">
  Skills: {Array.isArray(application.skills) && application.skills.length > 0 ? application.skills.join(", ") : (application.skills || "No Skills Provided")}
</p>

      </div>
      <div className="card-footer d-flex justify-content-center">
        <button className="btn btn-success w-50 me-1">Accept</button>
        <button className="btn btn-danger w-50 ms-1">Reject</button>
      </div>
    </div>
  );
}

export default Card3;
