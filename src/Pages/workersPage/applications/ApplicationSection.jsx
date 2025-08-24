import ApplicationTabs from './ApplicationTabs';
import ApplicationTable from './ApplicationTable';
import JobDetailsModal from './JobDetailsModal';
import Header from '../../../Components/Header';
import { useDispatch, useSelector } from 'react-redux';
import {  setShowModal, setCurrentJob } from '../../Redux/AppliModelSlice'

const ApplicationSection = () => {

  const dispatch = useDispatch(); 
  const { activeTab } = useSelector((state) => state.appTabs);
  const { showModal } = useSelector((state) => state.applicationsModel);

  const handleViewDetails = (job) => {
    dispatch(setCurrentJob(job));
   dispatch( setShowModal(true));
  };

  return (
    <div>
      <Header/>
    <div className="container mt-5 pt-5">
      {/* <h3 className="mb-3">Applications</h3> */}
      <ApplicationTabs />
      <div className="table-responsive">
        <ApplicationTable onViewDetails={handleViewDetails} activeTab={activeTab}/>
      </div>
      {showModal && <JobDetailsModal />}    
    </div>
    </div>
  );
};

export default ApplicationSection;
