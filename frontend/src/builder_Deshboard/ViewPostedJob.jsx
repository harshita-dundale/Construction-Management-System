// import { useAuth0 } from "@auth0/auth0-react";
// import Header from "../Components/Header";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import JobCard1 from "../Components/cards/JobCard1";
//  import EditJobModal from "./EditJobModal";
//  import { toast } from "react-toastify";

// function ViewPostedJobs() {
//   const { user, isLoading } = useAuth0();
//   const selectedProject = useSelector((state) => state.project.selectedProject);
//   const [projectsWithJobs, setProjectsWithJobs] = useState([]);
//   const [allJobs, setAllJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [jobToEdit, setJobToEdit] = useState(null);

//   useEffect(() => {
//     if (!user?.sub) return;

//     const url = `http://localhost:5000/api/jobs/builder/${encodeURIComponent(user.sub)}`;

//     fetch(url)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         if (data.data && Array.isArray(data.data)) {
//           setProjectsWithJobs(data.data);

//           const flatJobs = data.data.reduce((acc, project) => {
//             return acc.concat(project.jobs);
//           }, []);
//           setAllJobs(flatJobs);
//         } else {
//           setProjectsWithJobs([]);
//           setAllJobs([]);
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching jobs:", err);
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [user?.sub]);

//   const handleJobUpdate = async (updatedJob) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/jobs/${updatedJob._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedJob),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         toast.success("Job updated successfully!");
//         setAllJobs((prevJobs) =>
//           prevJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job))
//         );
//         setJobToEdit(null);
//       } else {
//         toast.error(result.message || "Failed to update job");
//       }
//     } catch (error) {
//       toast.error("Error updating job");
//       console.error(error);
//     }
//   };

//   if (error) return <p className="text-danger text-center">Error: {error}</p>;

//   const displayJobs = selectedProject
//     ? allJobs.filter((job) =>
//         projectsWithJobs.some(
//           (project) =>
//             project.projectId === selectedProject._id &&
//             project.jobs.some((pJob) => pJob._id === job._id)
//         )
//       )
//     : allJobs;

//   const rows = [];
//   for (let i = 0; i < displayJobs.length; i += 3) {
//     rows.push(displayJobs.slice(i, i + 3));
//   }
//   const handleDeleteJob = async (job) => {
//   const confirm = window.confirm("Are you sure you want to delete this job?");
//   if (!confirm) return;

//   try {
//     const res = await fetch(`http://localhost:5000/api/jobs/${job._id}`, {
//       method: "DELETE",
//     });

//     const data = await res.json();
//     if (res.ok) {
//       alert("Job deleted successfully!");
//       // Remove from UI
//       setAllJobs((prev) => prev.filter((j) => j._id !== job._id));
//     } else {
//       alert("Failed to delete: " + data.message);
//     }
//   } catch (err) {
//     console.error("Delete Error:", err);
//     alert("Error deleting job");
//   }
// };


//   return (
//     <>
//       <Header />
//       <div className="container" style={{ marginTop: "7rem" }}>
//         <h1 className="text-center mb-4">My Posted Jobs</h1>

//         <div className="mb-4 d-flex justify-content-between align-items-center">
//           <h5>Total Jobs: {displayJobs.length}</h5>
//           {selectedProject && (
//             <p className="text-muted">
//               Showing jobs for project: <strong>{selectedProject.name}</strong>
//             </p>
//           )}
//         </div>

//         {displayJobs.length === 0 ? (
//           <p className="text-muted text-center">
//             {selectedProject
//               ? "No jobs posted for this project yet."
//               : "No jobs posted yet."}
//           </p>
//         ) : (
//           <>
//             {!selectedProject &&
//               projectsWithJobs.map((project) => (
//                 <div key={project.projectId} className="mb-5">
//                   <h4 className="mb-3 border-bottom pb-2">
//                     📋 {project.projectName} ({project.jobs.length} jobs)
//                   </h4>
//                   <div className="row">
//                     {project.jobs.map((job, index) => (
//                       <div className="col-md-4 mb-5" key={job._id || index}>
//                         <JobCard1
//                           job={job}
//                           onEdit={(job) => setJobToEdit(job)}
//                           onDelete={(job) => console.log("delete job", job)}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}

//             {selectedProject && (
//               <div>
//                 {rows.map((row, index) => (
//                   <div className="row mb-4" key={index}>
//                     {row.map((job, jobIndex) => (
//                       <div className="col-md-4" key={job._id || jobIndex}>
//                         <JobCard1
//                           job={job}
//                           onEdit={(job) => setJobToEdit(job)}
//                           onDelete={(job) => console.log("delete job", job)}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//       {jobToEdit && (
//         <EditJobModal
//           job={jobToEdit}
//           onClose={() => setJobToEdit(null)}
//           onSave={(updatedJob) => handleJobUpdate(updatedJob)}
//         />
//       )}
//     </>
//   );
// }

// export default ViewPostedJobs;

import { useAuth0 } from "@auth0/auth0-react";
import Header from "../Components/Header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import JobCard1 from "../Components/cards/JobCard1";
import EditJobModal from "./EditJobModal";
import { toast } from "react-toastify";

function ViewPostedJobs() {
  const { user } = useAuth0();
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const [projectsWithJobs, setProjectsWithJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobToEdit, setJobToEdit] = useState(null);

  useEffect(() => {
    if (!user?.sub) return;

    const url = `http://localhost:5000/api/jobs/builder/${encodeURIComponent(user.sub)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          setProjectsWithJobs(data.data);
          const flatJobs = data.data.reduce((acc, project) => acc.concat(project.jobs), []);
          setAllJobs(flatJobs);
        } else {
          setProjectsWithJobs([]);
          setAllJobs([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user?.sub]);

  const handleJobUpdate = async (updatedJob) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${updatedJob._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedJob),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Job updated successfully!");
        setAllJobs((prevJobs) =>
          prevJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job))
        );
        setJobToEdit(null);
      } else {
        toast.error(result.message || "Failed to update job");
      }
    } catch {
      toast.error("Error updating job");
    }
  };

  // const handleDeleteJob = async (job) => {
  //   if (!window.confirm("Are you sure you want to delete this job?")) return;

  //   try {
  //     const res = await fetch(`http://localhost:5000/api/jobs/${job._id}`, { method: "DELETE" });
  //     const data = await res.json();

  //     if (res.ok) {
  //       alert("Job deleted successfully!");
  //       setAllJobs((prev) => prev.filter((j) => j._id !== job._id));
  //     } else {
  //       alert("Failed to delete: " + data.message);
  //     }
  //   } catch {
  //     alert("Error deleting job");
  //   }
  // };
  const handleDeleteJob = async (job) => {
  const confirm = window.confirm("Are you sure you want to delete this job?");
  if (!confirm) return;

  try {
    const res = await fetch(`http://localhost:5000/api/jobs/${job._id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (res.ok) {
      alert("Job deleted successfully!");

      // Dono states update karo taaki UI turant update ho jaye
      setAllJobs((prev) => prev.filter((j) => j._id !== job._id));

      setProjectsWithJobs((prevProjects) =>
        prevProjects.map((project) => ({
          ...project,
          jobs: project.jobs.filter((j) => j._id !== job._id),
        }))
      );
    } else {
      alert("Failed to delete: " + data.message);
    }
  } catch (err) {
    console.error("Delete Error:", err);
    alert("Error deleting job");
  }
};


  if (error) return <p className="text-danger text-center">Error: {error}</p>;
  if (loading) return <p className="text-center">Loading...</p>;

  const displayJobs = selectedProject
    ? allJobs.filter((job) =>
        projectsWithJobs.some(
          (project) =>
            project.projectId === selectedProject._id &&
            project.jobs.some((pJob) => pJob._id === job._id)
        )
      )
    : allJobs;

  // Split jobs into rows of 3
  const rows = [];
  for (let i = 0; i < displayJobs.length; i += 3) {
    rows.push(displayJobs.slice(i, i + 3));
  }

  return (
    <>
      <Header />
      <div className="container" style={{ marginTop: "7rem" }}>
        <h1 className="text-center mb-4">My Posted Jobs</h1>

        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h5>Total Jobs: {displayJobs.length}</h5>
          {selectedProject && (
            <p className="text-muted">
              Showing jobs for project: <strong>{selectedProject.name}</strong>
            </p>
          )}
        </div>

        {displayJobs.length === 0 ? (
          <p className="text-muted text-center">
            {selectedProject
              ? "No jobs posted for this project yet."
              : "No jobs posted yet."}
          </p>
        ) : (
          <>
            {/* If no project selected, show all projects with jobs */}
            {!selectedProject &&
              projectsWithJobs.map((project) => (
                <div key={project.projectId} className="mb-5">
                  <h4 className="mb-3 border-bottom pb-2">
                    📋 {project.projectName} ({project.jobs.length} jobs)
                  </h4>
                  <div className="row">
                    {project.jobs.map((job) => (
                      <div className="col-md-4 mb-5" key={job._id}>
                        <JobCard1
                          job={job}
                          onEdit={setJobToEdit}
                          onDelete={handleDeleteJob}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {/* If project selected, show jobs in rows of 3 */}
            {selectedProject &&
              rows.map((row, index) => (
                <div className="row mb-4" key={index}>
                  {row.map((job) => (
                    <div className="col-md-4" key={job._id}>
                      <JobCard1
                        job={job}
                        onEdit={setJobToEdit}
                        onDelete={handleDeleteJob}
                      />
                    </div>
                  ))}
                </div>
              ))}
          </>
        )}
      </div>

      {/* Edit modal */}
      {jobToEdit && (
        <EditJobModal
          job={jobToEdit}
          onClose={() => setJobToEdit(null)}
          onSave={handleJobUpdate}
        />
      )}
    </>
  );
}

export default ViewPostedJobs;
