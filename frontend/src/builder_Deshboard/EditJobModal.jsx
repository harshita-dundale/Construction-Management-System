import { useState, useEffect } from "react";
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
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton style={{ backgroundColor: "#1a4654", position: "relative" }}>
        <style>
          {`
      .modal-header .btn-close {
        filter: invert(1); /* Makes black X icon appear white */
      }
    `}
        </style>
        <Modal.Title className="text-white">Edit Job</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <div className="row">
              <div className="col-md-6 mb-2">
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-2">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-2">
                <Form.Label>Daily Payment</Form.Label>
                <Form.Control
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-2">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-2">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-2">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="PhoneNo"
                  value={formData.PhoneNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </Form.Group>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>

    </Modal>
  );
}

export default EditJobModal;
