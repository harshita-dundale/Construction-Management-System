import ApplicationTabs from './ApplicationTabs';
import ApplicationTable from './ApplicationTable';
import JobDetailsModal from './JobDetailsModal';
import Header from '../../../Components/Header';
import { useDispatch, useSelector } from 'react-redux';
import {  setShowModal, setCurrentJob } from '../../Redux/AppliModelSlice'
import { useEffect } from 'react';
import { fetchApplications } from '../../Redux/AppliActionSlice';
import { useAuth0 } from '@auth0/auth0-react';

const ApplicationSection = () => {

  const dispatch = useDispatch(); 
  const { user } = useAuth0(); // get worker email
  const { activeTab } = useSelector((state) => state.appTabs);
  const { showModal, currentJob } = useSelector((state) => state.applications);
//  const { showModal } = useSelector((state) => state.applicationsModel);

  const handleViewDetails = (job) => {
    dispatch(setCurrentJob(job));
   dispatch( setShowModal(true));
  };

 // ✅ fetch applications only for logged-in worker
// const { user } = useAuth0();
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchApplications(user.email));
    }
  }, [dispatch, user?.email]);

  return (
    <div>
      <Header/>
    <div className="container mt-5 pt-5">
      {/* <h3 className="mb-3">Applications</h3> */}
      <ApplicationTabs />
      <div className="table-responsive">
        <ApplicationTable onViewDetails={handleViewDetails} activeTab={activeTab}/>
      </div>
      {showModal && <JobDetailsModal job={currentJob}/>}    
    </div>
    </div>
  );
};

export default ApplicationSection;
