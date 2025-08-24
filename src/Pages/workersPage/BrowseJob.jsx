
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers, setRatings, setFilterLocation, setSortOption, toggleCardFlip, applyFilters,
} from "../Redux/UsersSlice";
import Header from "../../Components/Header";
import FilterBuilders from "../../Components/FilterBuilders";
import "./BrowseJob.css";
//import API_BASE_URL from "../../config";

function BrowseJob() {
  //const [jobs, setJobs] = useState([]);

  const dispatch = useDispatch();
  const { filteredUsers, ratings, flippedCards, filterLocation, sortOption, status,
  } = useSelector((state) => state.users);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(applyFilters());
  }, [filterLocation, sortOption, ratings, dispatch]);

  // useEffect(() => {
  //   fetch(`${API_BASE_URL}/api/jobs`)
  //     .then(response => response.json())
  //     .then(data => {
  //       setJobs(data); // Store jobs in state
  //     })
  //     .catch(error => console.error("Error fetching jobs:", error));
  // }, []);

  return (
    <div>
      <Header />

{/* <div className="">
<ul>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <li key={job._id}>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
            </li>
          ))
        ) : (
          <p>No jobs available</p>
        )}
      </ul>
</div> */}

      <div className="container" style={{ marginTop: "100px" }}>
        {/* Header Content */}
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

        {/* Filter and Sort */}
        <FilterBuilders
          filterLocation={filterLocation}
          setFilterLocation={(value) => dispatch(setFilterLocation(value))}
          sortOption={sortOption}
          setSortOption={(value) => dispatch(setSortOption(value))}
        />

        {/* Builders Cards */}
        <div className="row g-4 d-flex justify-content-center">
          {filteredUsers.map((builder, index) => (
            <div
              className="col-md-4 col-sm-6 d-flex align-items-stretch"
              key={index}
            >
              <div
                className={`card-flip h-100 ${flippedCards.includes(builder.login.uuid) ? "is-flipped" : ""
                  }`}
              >
                {/* Card Front */}
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
                      <p className="card-text">Phone: {builder.phone}</p>
                      <p className="card-text">Daily Payment: 400rs</p>
                      <button
                        className="seeMore btn btn-dark mt-auto"
                        onClick={() =>
                          dispatch(toggleCardFlip(builder.login.uuid))
                        }
                      >
                        See More
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Back */}
                <div className="card-back">
                  <div className="card text-center h-100">
                    <div className="card-body" style={{ background: "#e2ecea" }}>
                      <div className="mt-auto text-dark"
                        style={{ height: "30px", width: "40px", color: "black", cursor: "pointer" }}
                        onClick={() => dispatch(toggleCardFlip(builder.login.uuid))}>
                        Back
                      </div>
                      <h5 className="card-title">
                        Location: {builder.location.city},{" "}
                        {builder.location.country}
                      </h5>
                      <p className="card-text">{builder.email}</p>
                      <p className="card-text text-muted">Start: 02-04-2025</p>
                      <p className="card-text text-muted">End: 17-04-2025</p>
                      <div >
                        {[...Array(5)].map((_, starIndex) => (
                          <i
                            key={starIndex}
                            className={`fa fa-star stars ${ratings[builder.login.uuid] > starIndex ? "checked" : ""
                              }`}
                            onClick={() =>
                              dispatch(
                                setRatings({
                                  builderId: builder.login.uuid,
                                  rating: starIndex + 1,
                                })
                              )
                            }
                          />
                        ))}
                      </div>
                      <button className="seeMore btn btn-dark mt-3"> Apply now
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

// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//    setRatings, setFilterLocation, setSortOption, toggleCardFlip, applyFilters,
//  // ✅ Import fetchJobs from Redux
// } from "../Redux/UsersSlice";
// import Header from "../../Components/Header";
// import FilterBuilders from "../../Components/FilterBuilders";
// import "./BrowseJob.css";

// function BrowseJob() {
//   const dispatch = useDispatch();

//   // ✅ Extract jobs from Redux
//   const { filteredUsers, ratings, flippedCards, filterLocation, sortOption,  jobs } =
//     useSelector((state) => state.users);

//   // ✅ Fetch Builders
//   // useEffect(() => {
//   //   if (status === "idle") {
//   //     dispatch(fetchUsers());
//   //   }
//   // }, [status, dispatch]);

//   // ✅ Fetch Jobs
//   // useEffect(() => {
//   //   dispatch(fetchJobs()); // Call Redux action to get jobs
//   // }, [dispatch]);

//   // ✅ Apply Filters for Builders
//   useEffect(() => {
//     dispatch(applyFilters());
//   }, [filterLocation, sortOption, ratings, dispatch]);

//   return (
//     <div>
//       <Header />

//       <div className="container" style={{ marginTop: "100px" }}>
//         {/* Header Content */}
//         <div className="row text-center d-flex justify-content-center">
//           <h1 className="mt-2" style={{ color: "#051821" }}>
//             Our Best Builders
//           </h1>
//           <p className="fs-5 pt-3 col-md-8">
//             Welcome to ConstrucHub! Join our skilled team for diverse
//             construction projects with fair pay, supportive leadership, and
//             growth opportunities. Apply now and help us build excellence!
//           </p>
//         </div>

//         {/* Filter and Sort */}
//         <FilterBuilders
//           filterLocation={filterLocation}
//           setFilterLocation={(value) => dispatch(setFilterLocation(value))}
//           sortOption={sortOption}
//           setSortOption={(value) => dispatch(setSortOption(value))}
//         />

//         {/* Builders Cards */}
//         <div className="row g-4 d-flex justify-content-center">
//           {filteredUsers.map((builder, index) => (
//             <div className="col-md-4 col-sm-6 d-flex align-items-stretch" key={index}>
//               <div className={`card-flip h-100 ${flippedCards.includes(builder.login.uuid) ? "is-flipped" : ""}`}>
//                 {/* Card Front */}
//                 <div className="card-front">
//                   <div className="card text-center h-100">
//                     <div className="card-body" style={{ background: "#e2ecea" }}>
//                       <img
//                         src={builder.picture.large}
//                         alt={builder.name.first}
//                         className="rounded-circle mb-3"
//                         style={{ width: "100px", height: "100px" }}
//                       />
//                       <h5 className="card-title">{builder.name.first} {builder.name.last}</h5>
//                       <p className="card-text">Phone: {builder.phone}</p>
//                       <p className="card-text">Daily Payment: 400rs</p>
//                       <button
//                         className="seeMore btn btn-dark mt-auto"
//                         onClick={() => dispatch(toggleCardFlip(builder.login.uuid))}
//                       >
//                         See More
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Card Back */}
//                 <div className="card-back">
//                   <div className="card text-center h-100">
//                     <div className="card-body" style={{ background: "#e2ecea" }}>
//                       <div className="mt-auto text-dark"
//                         style={{ height: "30px", width: "40px", color: "black", cursor: "pointer" }}
//                         onClick={() => dispatch(toggleCardFlip(builder.login.uuid))}>
//                         Back
//                       </div>
//                       <h5 className="card-title">
//                         Location: {builder.location.city}, {builder.location.country}
//                       </h5>
//                       <p className="card-text">{builder.email}</p>
//                       <p className="card-text text-muted">Start: 02-04-2025</p>
//                       <p className="card-text text-muted">End: 17-04-2025</p>
//                       <div>
//                         {[...Array(5)].map((_, starIndex) => (
//                           <i
//                             key={starIndex}
//                             className={`fa fa-star stars ${ratings[builder.login.uuid] > starIndex ? "checked" : ""}`}
//                             onClick={() =>
//                               dispatch(setRatings({
//                                 builderId: builder.login.uuid,
//                                 rating: starIndex + 1,
//                               }))
//                             }
//                           />
//                         ))}
//                       </div>
//                       <button className="seeMore btn btn-dark mt-3"> Apply now </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ✅ JOB LISTINGS SECTION */}
//         <div className="row mt-5">
//           <h2 className="text-center mb-4">Available Jobs</h2>
//           {jobs.length > 0 ? (
//             jobs.map((job) => (
//               <div className="col-md-6 mb-4" key={job._id}>
//                 <div className="card">
//                   <div className="card-body">
//                     <h5 className="card-title">{job.title}</h5>
//                     <p className="card-text">{job.description}</p>
//                     <p className="card-text"><strong>Location:</strong> {job.location}</p>
//                     <p className="card-text"><strong>Salary:</strong> {job.salary} Rs</p>
//                     <button className="btn btn-dark">Apply Now</button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center">No jobs available</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BrowseJob;
