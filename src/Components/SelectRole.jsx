/* eslint-disable react/prop-types */
function SelectRole({imgSrc, h1Text, pText, buttonText, onClick }) {
  //        <div className="col-md-6 col-12 d-flex flex-column justify-content-between h-100">
    return (
        <> 
        <div className="col-md-6 col-12 d-flex flex-column h-100">
          <div className="text-center">
            <img src={imgSrc} width="250" height="130" alt={h1Text} className="img-fluid rounded" />
            <h1 style={{ color: "#f58800" }}>{h1Text}</h1>
            </div>

          <p className="fs-5 mt-3">{pText}</p>
          <button className="btn btn-light rounded-pill align-self-center roleSelect-btn" onClick={onClick}>{buttonText}</button>
        </div>
        </>
    )
}

export default SelectRole;