// import React, { useEffect, useState } from "react";
// function HiredWorkers() {
//   const [hired, setHired] = useState([]);
//   useEffect(() => {
//     fetch("http://localhost:5000/api/apply")
//       .then((res) => res.json())
//       .then((data) => {
//         const accepted = data.filter((app) => app.status === "accepted");
//         setHired(accepted);
//       })
//       .catch((err) => console.error("Error fetching hired workers:", err));
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4 text-center">👷‍♂️ Hired Workers</h2>
//       <div className="row">
//         {hired.length === 0 ? (
//           <p className="text-center text-muted">No workers hired yet.</p>
//         ) : (
//           hired.map((worker) => (
//             <div className="col-md-4 mb-3" key={worker._id}>
//               <div className="card p-3 shadow-sm">
//                 <h5>{worker.name}</h5>
//                 <p><strong>Phone:</strong> {worker.phoneNo}</p>
//                 <p><strong>Skills:</strong> {worker.skills}</p>
//                 <p><strong>Experience:</strong> {worker.experience} years</p>
//                 <span className="badge bg-success">Hired</span>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default HiredWorkers;

import React, { useEffect, useState } from "react";
import Card3 from "../../Components/cards/Card3"; // ✅ Correct import path
import Header from "../../Components/Header";
function HiredWorkers() {
  const [hired, setHired] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/apply")
      .then((res) => res.json())
      .then((data) => {
        const accepted = data.filter((app) => app.status === "accepted");
        setHired(accepted.slice(0, 3)); // ✅ Sirf pehle 3 workers dikhane ke liye
      })
      .catch((err) => console.error("Error fetching hired workers:", err));
  }, []);

  return (
    <>
    <Header />
    <br />
    <br />
    <div className="container mt-5">
      <h2 className="mb-4 text-center">👷‍♂️ Hired Workers</h2>
      <div className="row">
        {hired.length === 0 ? (
          <p className="text-center text-muted">No workers hired yet.</p>
        ) : (
          hired.map((worker) => (
            <div className="col-md-4 mb-3" key={worker._id}>
              <Card3 application={worker} /> {/* ✅ Reusing Card3 component */}
            </div>
          ))
        )}
      </div>
    </div></>
  );
}

export default HiredWorkers;
