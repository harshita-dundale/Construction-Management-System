import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditJobModal({ job, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    startDate: "",
    endDate: "",
    PhoneNo: "",
    Email: "",

  });

  useEffect(() => {
    if (job) {
      setFormData({ ...job });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <Modal show={true} onHide={onClose} centered size="lg" >
        <div className="modal-content-wrapper">
          <div className="modal-header-modern">
            <div className="header-content">
              <div className="header-icon">
                <i className="fas fa-edit"></i>
              </div>
              <div className="header-text">
                <h4 className="modal-title-modern">Edit Job Posting</h4>
                <p className="modal-subtitle">Update job details and requirements</p>
              </div>
            </div>
            <button className="close-button-modern" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="modal-body-modern">
            <Form onSubmit={handleSubmit}>
              <div className="form-sections">
                {/* Job Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-briefcase section-icon"></i>
                    <h6 className="section-title">Job Information</h6>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <i className="fas fa-tag me-2"></i>
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          className="form-control-modern"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter job title"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          className="form-control-modern"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Enter job location"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment & Duration Section */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-rupee-sign section-icon"></i>
                    <h6 className="section-title">Payment & Duration</h6>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <i className="fas fa-money-bill-wave me-2"></i>
                          Daily Payment (₹)
                        </label>
                        <input
                          type="number"
                          name="salary"
                          className="form-control-modern"
                          value={formData.salary}
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <i className="fas fa-calendar-plus me-2"></i>
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          className="form-control-modern"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <i className="fas fa-calendar-minus me-2"></i>
                          End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          className="form-control-modern"
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-address-book section-icon"></i>
                    <h6 className="section-title">Contact Information</h6>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <i className="fas fa-phone me-2"></i>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="PhoneNo"
                          className="form-control-modern"
                          value={formData.PhoneNo}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <i className="fas fa-envelope me-2"></i>
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="Email"
                          className="form-control-modern"
                          value={formData.Email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  <i className="fas fa-times me-2"></i>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <i className="fas fa-save me-2"></i>
                  Save Changes
                </button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
      
      {/* Enhanced Styles */}
      <style jsx>{`
        .modern-edit-modal .modal-dialog {
          max-width: 800px;
        }
        
        .modal-content-wrapper {
          border-radius: 20px;
          overflow: hidden;
          border: none;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
        
        .modal-header-modern {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: none;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .header-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .modal-title-modern {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .modal-subtitle {
          margin: 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }
        
        .close-button-modern {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }
        
        .close-button-modern:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }
        
        .modal-body-modern {
          padding: 2rem;
          background: #f8f9fa;
        }
        
        .form-sections {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .form-section {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f8f9fa;
        }
        
        .section-icon {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.9rem;
        }
        
        .section-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .form-group-modern {
          margin-bottom: 0;
        }
        
        .form-label-modern {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .form-control-modern {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: white;
        }
        
        .form-control-modern:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #e9ecef;
        }
        
        .btn-cancel {
          background: #6c757d;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        
        .btn-cancel:hover {
          background: #5a6268;
          transform: translateY(-2px);
          color: white;
        }
        
        .btn-save {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          color: white;
        }
        
        @media (max-width: 768px) {
          .modal-header-modern {
            padding: 1.5rem;
          }
          
          .modal-body-modern {
            padding: 1.5rem;
          }
          
          .form-section {
            padding: 1rem;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .btn-cancel,
          .btn-save {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}

export default EditJobModal;
const buttonStyle = {
  backgroundColor: "var(--primary-color)",
  transition: "background-color 0.3s ease, color 0.3s ease",
  color: "var(--text-color)",
};