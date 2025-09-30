import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card3 from "../../Components/cards/Card3"; 
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import BackButton from "../../Components/BackButton";
import DashboardHeader from '../../builder_Deshboard/BuilderDashboard/DashboardHeader';
import EmptyState from '../../Components/EmptyState';
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
      <Sidebar />
      
      <DashboardHeader
        title="Hired Workers Management"
        subtitle="Manage and monitor your hired construction workers. Track their performance, handle contracts, and maintain workforce records efficiently."
        // badgeText={selectedProject?.name || "Worker Management"}
        stats={[
          { number: hired.length, label: "Total Workers" },
          { number: hired.filter(w => w.status === 'joined').length, label: "Active Workers" },
        ]}
      />
      
      <div className="hired-workers-container">
        <div className="container">
          {/* <div className="page-header">
            <div className="header-content">
              <div className="header-icon">
                <GrUserWorker />
              </div>
              <div className="header-text">
                <h3 className="header-title">Your Workforce</h3>
                <p className="header-subtitle">Manage hired workers for {selectedProject?.name || 'your project'}</p>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">{hired.length}</span>
                <span className="stat-label">Total Hired</span>
              </div>
            </div>
          </div> */}
          
          <div className="workers-section">
            {hired.length === 0 ? (
              <EmptyState 
                icon="fas fa-users"
                title="No Workers Hired Yet"
                message="Start building your team by reviewing and hiring qualified workers from job applications."
                actionButton={
                  <button 
                    className="btn btn-primary-gradient" 
                    onClick={() => navigate('/ViewApplications')}
                  >
                    <i className="fas fa-search me-2"></i>
                    View Applications
                  </button>
                }
              />
            ) : (
              <>
                <div className="">
                  <h4 className="section-title">
                    <i className="fas fa-users me-2"></i>
                    Active Workers ({hired.length})
                  </h4>
                  {/* <p className="section-subtitle">Manage your hired workforce and their details</p> */}
                </div>
                
                <div className="row g-4">
                  {hired.map((worker) => (
                    <div className="col-xl-4 col-lg-6 col-md-6" key={worker._id}>
                      <Card3 
                        application={worker} 
                      /> 
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hired-workers-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 1rem 0;
        }
        
        .page-header {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(102, 126, 234, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .header-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }
        
        .header-title {
          color: #2c3e50;
          margin: 0;
          font-weight: 700;
          // font-size: 1.5rem;
        }
        
        .header-subtitle {
          color: #6c757d;
          margin: 0.25rem 0 0 0;
          font-size: 0.95rem;
        }
        
        .header-stats {
          text-align: center;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          color: white;
          min-width: 100px;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
        }
        
        .stat-label {
          font-size: 0.8rem;
          opacity: 0.9;
          margin-top: 0.25rem;
        }
        
        .workers-section {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(102, 126, 234, 0.1);
        }
        .section-title {
          color: #2c3e50;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .section-subtitle {
          color: #6c757d;
          margin: 0;
        }
        
        .btn-primary-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .btn-primary-gradient:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          color: white;
        }
        
        @media (max-width: 768px) {
          .hired-workers-container {
            padding: 1rem 0;
          }
          
          .page-header {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
            padding: 1.5rem;
          }
          
          .header-content {
            flex-direction: column;
            text-align: center;
          }
          
          .workers-section {
            padding: 1.5rem;
          }
        }
      `}} />
    </>
  );
}

export default HiredWorkers;