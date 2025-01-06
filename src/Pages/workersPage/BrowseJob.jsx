import { useEffect, useState } from "react";
import "./BrowseJob.css";
import Header from "../../Components/Header";
import FilterBuilders from "../../Components/FilterBuilders";

function BrowseJob() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [ratings, setRatings] = useState({});
  const [sortOption, setSortOption] = useState("none");
  const [filterLocation, setFilterLocation] = useState("");

  const exampleSkills = ["Masonry", "Plumbing", "Painting"];

  async function getUsers() {
    try {
      const response = await fetch("https://randomuser.me/api/?results=12");
      const FinalData = await response.json();
      setUsers(FinalData.results);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  const handleRating = (builderId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [builderId]: rating,
    }));
  };

  const applyFilters = () => {
    let updatedUsers = [...users];

    // Filter by location
    if (filterLocation) {
      updatedUsers = updatedUsers.filter((user) =>
        user.location.city.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    // Sort by selected option
    if (sortOption === "rating") {
      updatedUsers.sort(
        (a, b) => (ratings[b.login.uuid] || 0) - (ratings[a.login.uuid] || 0)
      );
    } else if (sortOption === "name") {
      updatedUsers.sort((a, b) => a.name.first.localeCompare(b.name.first));
    }

    setFilteredUsers(updatedUsers);
  };

  useEffect(() => {
    applyFilters();
  }, [sortOption, filterLocation, ratings, users]);

  return (
    <div>
      <Header />

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

        {/* Filter and Sort Component */}
        <FilterBuilders
  filterLocation={filterLocation}
  setFilterLocation={setFilterLocation}
  sortOption={sortOption}
  setSortOption={setSortOption}
/>


        <div className="row g-4 d-flex justify-content-center">
          {filteredUsers.map((builder, index) => (
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
                    <div className="card-body" style={{ background: "#e2ecea" }}>
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
                      {/* Skill Badges */}
                      <div className="skills mb-3">
                        {exampleSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="badge bg-light text-dark me-2"
                            style={{ fontSize: "14px" }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <button className="seeMore btn btn-light mt-auto">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back of the Flip Card */}
                <div className="card-back">
                  <div className="card text-center h-100">
                    <div className="card-body" style={{ background: "#e2ecea" }}>
                      <h5 className="card-title">
                        Location: {builder.location.city},{" "}
                        {builder.location.country}
                      </h5>
                      <p className="card-text">Phone: {builder.phone}</p>

                      {/* Star Rating System */}
                      <div className="rating-section">
                        <h6>Rate this Builder:</h6>
                        <div className="stars">
                          {[...Array(5)].map((_, starIndex) => (
                            <i
                              key={starIndex}
                              className={`fa fa-star ${
                                ratings[builder.login.uuid] > starIndex
                                  ? "checked"
                                  : ""
                              }`}
                              onClick={() =>
                                handleRating(builder.login.uuid, starIndex + 1)
                              }
                            />
                          ))}
                        </div>
                        <p className="average-rating">
                          Current Rating:{" "}
                          {ratings[builder.login.uuid] || "No rating yet"}
                        </p>
                      </div>
                      <button className="seeMore btn btn-light mt-auto">
                        Apply Now
                      </button>
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
