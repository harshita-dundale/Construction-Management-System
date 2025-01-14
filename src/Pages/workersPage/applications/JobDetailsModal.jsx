import { Modal, Button, Card } from 'react-bootstrap';

const JobDetailsModal = ({ show, onClose, jobDetails }) => {
  if (!jobDetails) return null; // Ensure jobDetails exists

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Job Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Body>
            <h5>{jobDetails.title}</h5>
            <p><strong>Job Title</strong> {jobDetails.description}</p>
            <p><strong>Status:</strong> {jobDetails.status}</p>
            <p><strong>Application Date:</strong> {jobDetails.date}</p>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JobDetailsModal;
