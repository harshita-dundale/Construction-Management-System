import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card3 from "../Components/cards/Card3";
import Header from "../Components/Header";
import { fetchApplications, setFilteredApplications } from "../Pages/Redux/applicationsSlice";

function ViewApplications() {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.applications);

  const [statusFilter, setStatusFilter] = useState("all");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  useEffect(() => {
    dispatch(fetchApplications()); // Redux store me backend se data lana
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...applications];

    if (statusFilter !== "all") {
      filtered = filtered.filter((application) => application.status === statusFilter);
    }

    if (skillsFilter) {
      filtered = filtered.filter((application) =>
        application.skills.some((skill) => skill.toLowerCase().includes(skillsFilter.toLowerCase()))
      );
    }

    if (experienceFilter) {
      filtered = filtered.filter((application) => application.experience >= experienceFilter);
    }

    dispatch(setFilteredApplications(filtered));
  }, [statusFilter, skillsFilter, experienceFilter, applications, dispatch]);

  const rows = [];
  for (let i = 0; i < applications.length; i += 3) {
    rows.push(applications.slice(i, i + 3));
  }

  return (
    <div>
      <Header />
      <div className="container">
        <h1 className="text-center mb-4" style={{ marginTop: "7rem", color: "#333" }}>
          View Applications
        </h1>

        <div className="filters p-4 mb-4 rounded shadow bg-light" style={filterBoxStyle}>
          <h3 className="mb-3 text-info" style={headingStyle}>Filters</h3>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="status" className="form-label" style={labelStyle}>Status</label>
              <select
                id="status"
                className="form-select shadow-sm"
                style={inputStyle}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="shortlisted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="under_review">Under Review</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="skills" className="form-label" style={labelStyle}>Skills</label>
              <input
                type="text"
                id="skills"
                className="form-control shadow-sm"
                style={inputStyle}
                placeholder="Search skills"
                value={skillsFilter}
                onChange={(e) => setSkillsFilter(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="experience" className="form-label" style={labelStyle}>Experience</label>
              <input
                type="number"
                id="experience"
                className="form-control shadow-sm"
                style={inputStyle}
                placeholder="Years"
                min="0"
                max="30"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="applications p-4 rounded" style={cardContainerStyle}>
          {loading ? <p>Loading...</p> : error ? <p>Error: {error}</p> :
            rows.map((row, index) => (
              <div className="row mb-4" key={index}>
                {row.map((application) => (
                  <div className="col-md-4" key={application.id}>
                    <Card3 application={application} />
                  </div>
                ))}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ✅ Fix: Define Missing Style Objects
const filterBoxStyle = {
  border: "2px solid rgb(46, 199, 204)",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const headingStyle = {
  fontWeight: "bold",
};

const labelStyle = {
  fontWeight: "600",
  color: "#555",
};

const inputStyle = {
  borderRadius: "8px",
  border: "1px solid #ddd",
  padding: "10px",
};

const cardContainerStyle = {
  borderRadius: "10px",
  border: "2px solid #ccc",
};

export default ViewApplications;


// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Card3 from "../Components/cards/Card3";
// import Header from "../Components/Header";
// import { fetchApplications, setFilteredApplications } from "../Pages/Redux/applicationsSlice";

// function ViewApplications() {
//   const dispatch = useDispatch();
//   const { applications, loading, error, filteredApplications } = useSelector((state) => state.applications);

//   const [statusFilter, setStatusFilter] = useState("all");
//   const [skillsFilter, setSkillsFilter] = useState("");
//   const [experienceFilter, setExperienceFilter] = useState("");

//   useEffect(() => {
//     dispatch(fetchApplications());
//   }, [dispatch]);

//   useEffect(() => {
//     let filtered = [...applications];

//     if (statusFilter !== "all") {
//       filtered = filtered.filter((application) => application.status === statusFilter);
//     }

//     if (skillsFilter) {
//       filtered = filtered.filter((application) =>
//         application.skills?.some((skill) =>
//           skill.toLowerCase().includes(skillsFilter.toLowerCase())
//         )
//       );
//     }

//     if (experienceFilter) {
//       filtered = filtered.filter((application) => application.experience >= experienceFilter);
//     }

//     dispatch(setFilteredApplications(filtered));
//   }, [statusFilter, skillsFilter, experienceFilter, applications, dispatch]);

//   // Divide filteredApplications into rows of 3
//   const rows = [];
//   for (let i = 0; i < filteredApplications.length; i += 3) {
//     rows.push(filteredApplications.slice(i, i + 3));
//   }

//   return (
//     <div>
//       <Header />
//       <div className="container">
//         <h1 className="text-center mb-4" style={{ marginTop: "7rem", color: "#333" }}>
//           View Applications
//         </h1>

//         <div className="filters p-4 mb-4 rounded shadow bg-light" style={filterBoxStyle}>
//           <h3 className="mb-3 text-info" style={headingStyle}>Filters</h3>
//           <div className="row g-3">
//             <div className="col-md-4">
//               <label htmlFor="status" className="form-label" style={labelStyle}>Status</label>
//               <select
//                 id="status"
//                 className="form-select shadow-sm"
//                 style={inputStyle}
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="all">All</option>
//                 <option value="shortlisted">Accepted</option>
//                 <option value="rejected">Rejected</option>
//                 <option value="under_review">Pending</option>
//               </select>
//             </div>
//             <div className="col-md-4">
//               <label htmlFor="skills" className="form-label" style={labelStyle}>Skills</label>
//               <input
//                 type="text"
//                 id="skills"
//                 className="form-control shadow-sm"
//                 style={inputStyle}
//                 placeholder="Search skills"
//                 value={skillsFilter}
//                 onChange={(e) => setSkillsFilter(e.target.value)}
//               />
//             </div>
//             <div className="col-md-4">
//               <label htmlFor="experience" className="form-label" style={labelStyle}>Experience</label>
//               <input
//                 type="number"
//                 id="experience"
//                 className="form-control shadow-sm"
//                 style={inputStyle}
//                 placeholder="Years"
//                 min="0"
//                 max="30"
//                 value={experienceFilter}
//                 onChange={(e) => setExperienceFilter(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="applications p-4 rounded" style={cardContainerStyle}>
//           {loading ? (
//             <p>Loading...</p>
//           ) : error ? (
//             <p>Error: {error}</p>
//           ) : (
//             rows.map((row, rowIndex) => (
//               <div className="row mb-4" key={`row-${rowIndex}`}>
//                 {row.map((application) => (
//                   <div className="col-md-4" key={`app-${application.id}`}>
//                     <Card3 application={application} />
//                   </div>
//                 ))}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Styling
// const filterBoxStyle = {
//   border: "2px solid rgb(46, 199, 204)",
//   borderRadius: "10px",
//   padding: "20px",
//   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// };

// const headingStyle = {
//   fontWeight: "bold",
// };

// const labelStyle = {
//   fontWeight: "600",
//   color: "#555",
// };

// const inputStyle = {
//   borderRadius: "8px",
//   border: "1px solid #ddd",
//   padding: "10px",
// };

// const cardContainerStyle = {
//   borderRadius: "10px",
//   border: "2px solid #ccc",
// };

// export default ViewApplications;
