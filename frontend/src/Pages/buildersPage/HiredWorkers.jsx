
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card3 from "../../Components/cards/Card3"; 
import Header from "../../Components/Header";

function HiredWorkers() {
  const [hired, setHired] = useState([]);
  const selectedProject = useSelector((state) => state.project.selectedProject); 

  useEffect(() => {
    if (!selectedProject?._id) return;
  const fetchHired = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/apply?status=accepted&projectId=${selectedProject._id}`
      );
      const data = await res.json();
      setHired(data);
    } catch (err) {
      console.error("Error fetching hired workers:", err);
    }
  };

  fetchHired();
}, [selectedProject]);
  return (
    <>
    <Header />
    <br />
    <br />
    <div className="container" style={{ marginTop: "90px"}}>
      <h2 className="mb-4 text-center">👷‍♂️ Hired Workers</h2>
      <div className="row">
        {hired.length === 0 ? (
          <p className="text-center text-muted">No workers hired yet.</p>
        ) : (
          hired.map((worker) => (
            <div className="col-md-4 mb-3" key={worker._id}>
              <Card3 application={worker} isHiredView={true}/> 
            </div>
          ))
        )}
      </div>
    </div></>
  );
}

export default HiredWorkers;