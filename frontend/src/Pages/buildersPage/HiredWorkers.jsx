import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card3 from "../../Components/cards/Card3"; 
import Header from "../../Components/Header";
import BackButton from "../../Components/BackButton";
import { GrUserWorker } from "react-icons/gr";

function HiredWorkers() {
  const [hired, setHired] = useState([]);
  const selectedProject = useSelector((state) => state.project.selectedProject); 
  const navigate = useNavigate();

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
      <div className="container" style={{ marginTop: "90px"}}>
        {/* Back Button */}
        <div className="back-button-container-hired" style={{ marginTop: "2rem", marginBottom: "1rem" }}>
          <BackButton to="/project_pannel" text="Back to Projects" variant="outline" />
        </div>

        <h2 className="mb-5 text-center fw-bold" style={{ color: "#333" }}>
          <GrUserWorker className="mb-2 me-2 fw-bold"/>
          Hired Workers
        </h2>
        
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
      </div>

      {/* Inline Styles for Back Button */}
      <style dangerouslySetInnerHTML={{__html: `
        .back-button-container-hired {
          padding: 1rem 0;
        }

        .btn-back-hired {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-back-hired:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .back-button-container-hired {
            padding: 0.5rem 0;
          }
          
          .btn-back-hired {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}} />
    </>
  );
}

export default HiredWorkers;