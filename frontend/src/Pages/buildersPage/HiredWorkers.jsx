
import { useEffect, useState } from "react";
import Card3 from "../../Components/cards/Card3"; 
import Header from "../../Components/Header";
function HiredWorkers() {
  const [hired, setHired] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/apply")
      .then((res) => res.json())
      .then((data) => {
        const accepted = data.filter((app) => app.status === "accepted");
        setHired(accepted.slice(0, 3)); 
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
              <Card3 application={worker} isHiredView={true}/> 
            </div>
          ))
        )}
      </div>
    </div></>
  );
}

export default HiredWorkers;