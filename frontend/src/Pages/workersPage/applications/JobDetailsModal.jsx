// import { useSelector, useDispatch } from 'react-redux';
// import { Modal, Button, Card } from 'react-bootstrap';
// import { setShowModal } from '../../Redux/applicationsSlice';

// const JobDetailsModal = () => {
//   const dispatch = useDispatch();
//   const { showModal, currentJob } = useSelector((state) => state.applicationsModel);

//   if (!currentJob) return null; // Ensure jobDetails exists

//   return (
//     <Modal
//       show={showModal} // The modal visibility is controlled by Redux store
//       onHide={() => dispatch(setShowModal(false))} // Dispatch action to hide modal
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title>Job Details</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Card>
//           <Card.Body>
//             <h5>{currentJob.title}</h5>
//             <p><strong>Job Title:</strong> {currentJob.description}</p>
//             <p><strong>Status:</strong> {currentJob.status}</p>
//             <p><strong>Application Date:</strong> {currentJob.date}</p>
//           </Card.Body>
//         </Card>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={() => dispatch(setShowModal(false))}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default JobDetailsModal;


import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Card } from 'react-bootstrap';
import { setShowModal } from '../../Redux/applicationsSlice';

const JobDetailsModal = () => {
  const dispatch = useDispatch();
  const { showModal, currentJob } = useSelector((state) => state.applications);

  if (!currentJob) return null;

  return (
    <Modal
      show={showModal}
      onHide={() => dispatch(setShowModal(false))}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Job Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Body>
            <h5>{currentJob.title}</h5>
            <p><strong>Description:</strong> {currentJob.description}</p>
            <p><strong>Status:</strong> {currentJob.status}</p>
            <p><strong>Application Date:</strong> {new Date(currentJob.appliedAt).toLocaleDateString()}</p>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setShowModal(false))}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JobDetailsModal;

