import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card3 from "../../Components/cards/Card3"; 
import Header from "../../Components/Header";
import { GrUserWorker } from "react-icons/gr";

function HiredWorkers() {
  const [hired, setHired] = useState([]);
  const selectedProject = useSelector((state) => state.project.selectedProject); 

  const fetchHired = async () => {
    if (!selectedProject?._id) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/apply?status=joined&projectId=${selectedProject._id}`
      );
      const data = await res.json();
      setHired(data);
    } catch (err) {
      console.error("Error fetching hired workers:", err);
    }
  };

  useEffect(() => {
    fetchHired();
  }, [selectedProject]);
  return (
    <>
    <Header />
    <br />
    <br />
    <div className="container" style={{ marginTop: "90px"}}>
      <h2 className="mb-5 text-center fw-bold" style={{ marginTop: "8rem", color: "#333" }}><GrUserWorker className="mb-2 me-2 fw-bold"/>
 Hired Workers</h2>
      <div className="row">
        {hired.length === 0 ? (
          <p className="text-center text-muted">No workers hired yet.</p>
        ) : (
          hired.map((worker) => (
            <div className="col-md-4 mb-3" key={worker._id}>
              <Card3 application={worker} isHiredView={true} onDelete={fetchHired}/> 
            </div>
          ))
        )}
      </div>
    </div></>
  );
}

export default HiredWorkers;