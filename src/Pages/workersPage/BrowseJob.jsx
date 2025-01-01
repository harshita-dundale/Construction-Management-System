import { useEffect, useState } from "react";
import "./BrowseJob.css";
import Header from "../../Components/Header";

function BrowseJob() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await fetch("https://randomuser.me/api/?results=12");
      const FinalData = await response.json();
      setUsers(FinalData.results);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <Header/>

      <div className="container" style={{ marginTop: "100px" }}>
        <div className="row text-center d-flex justify-content-center">
          <h1 className="mt-2" style={{ color: "#051821" }}>
            Our Best Builders
          </h1>
          <p className="fs-5 pt-3 col-md-8">
            Welcome to ConstrucHub! Join our skilled team for diverse
            construction projects with fair pay, supportive leadership, and
            growth opportunities. Apply now and help us build excellence!
          </p>
        </div>
        <div className="row g-4 d-flex justify-content-center">
          {users.map((builder, index) => (
            <div
              className="col-md-4 col-sm-6 d-flex align-items-stretch"
              key={index}
            >
              <div
                className="card-flip h-100"
                style={{ maxWidth: "100%", margin: "0 auto" }}
              >
                {/* Front of the Flip Card */}
                <div className="card-front">
                  <div className="card text-center h-100">
                    <div className="card-body" style={{background:"#e2ecea"}}>
                      <img
                        src={builder.picture.large}
                        alt={builder.name.first}
                        className="rounded-circle mb-3"
                        style={{ width: "100px", height: "100px" }}
                      />
                      <h5 className="card-title">
                        {builder.name.first} {builder.name.last}
                      </h5>
                      <p className="card-text text-muted">{builder.email}</p>
                      <button className="seeMore btn btn-light mt-auto">Apply Now</button>
                    </div>
                  </div>
                </div>

                {/* Back of the Flip Card */}
                <div className="card-back">
                  <div className="card text-center h-100">
                    <div className="card-body" style={{background:"#e2ecea"}}>
                      <h5 className="card-title">
                        Location: {builder.location.city}, {builder.location.country}
                      </h5>
                      <p className="card-text">Phone: {builder.phone}</p>
                      <button className="seeMore btn btn-light mt-auto">Apply Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrowseJob;
