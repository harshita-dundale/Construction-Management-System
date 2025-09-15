import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import "./EditModal.css";

function EditJobModal({
  mode = "jobModal", 
  job,
  project,
  show,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data based on mode
  useEffect(() => {
    if (mode === "jobModal" && job) {
      // Format dates for input fields
      const formattedJob = {
        ...job,
        startDate: job.startDate ? new Date(job.startDate).toISOString().split('T')[0] : '',
        endDate: job.endDate ? new Date(job.endDate).toISOString().split('T')[0] : ''
      };
      setFormData(formattedJob);
    } else if (mode === "projectModal" && project) {
      setFormData({
        name: project.name || "",
        type: project.type || "",
        location: project.location || "",
        clientName: project.clientName || "",
        expectedCost: project.expectedCost || "",
      });
    }
  }, [mode, job, project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "projectModal") {
      // Update project via API
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/${project._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          Swal.fire({
            title: "Updated!",
            text: "Project has been updated successfully.",
            icon: "success",
            confirmButtonColor: "#667eea",
          });

          if (onSave) onSave(formData);
          onClose();
        } else {
          throw new Error("Failed to update project");
        }
      } catch (error) {
        console.error("Error updating project:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update project. Please try again.",
          icon: "error",
          confirmButtonColor: "#667eea",
        });
      }
    } else {
      // For job modal (just return values, no API)
      if (onSave) onSave(formData);
    }
  };

  if (mode === "jobModal") {
    return (
      <Modal show={show !== undefined ? show : !!job} onHide={onClose} centered size="lg" >
<div className="modal-content-wrapper">
  <div className="modal-header-edit">
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
  
  <div className="modal-body-edit">
    <Form onSubmit={handleSubmit}>
      <div className="form-sections">
        {/* Job Information Section */}
        <div className="edit-form-section">
          <div className="edit-header">
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
                  value={formData.title || ''}
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
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="Enter job location"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Duration Section */}
        <div className="edit-form-section">
          <div className="edit-header">
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
                  value={formData.salary || ''}
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
                  value={formData.startDate || ''}
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
                  value={formData.endDate || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="edit-form-section">
          <div className="edit-header">
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
                  value={formData.PhoneNo || ''}
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
                  value={formData.Email || ''}
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
    );
  }

  if (mode === "projectModal") {
    return (
      <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Project</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="Project Name"
              required
            />
          </Form.Group>
      
          <Form.Group className="mb-3">
            <Form.Label>Project Type</Form.Label>
            <Form.Control
              type="text"
              name="type"
              value={formData.type || ''}
              onChange={handleChange}
              placeholder="Project Type"
            />
          </Form.Group>
      
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              placeholder="Location"
            />
          </Form.Group>
      
          <Form.Group className="mb-3">
            <Form.Label>Client Name</Form.Label>
            <Form.Control
              type="text"
              name="clientName"
              value={formData.clientName || ''}
              onChange={handleChange}
              placeholder="Client Name"
            />
          </Form.Group>
      
          <Form.Group className="mb-3">
            <Form.Label>Expected Cost</Form.Label>
            <Form.Control
              type="number"
              name="expectedCost"
              value={formData.expectedCost || ''}
              onChange={handleChange}
              placeholder="Expected Cost"
            />
          </Form.Group>
      
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
      </Modal>
    );
  }

  return null;
}

export default EditJobModal;