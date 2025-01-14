import  { useState } from 'react';
import ApplicationTabs from './ApplicationTabs';
import ApplicationTable from './ApplicationTable';
import JobDetailsModal from './JobDetailsModal';
import Header from '../../../Components/Header';

const ApplicationSection = () => {
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  const allApplications = [
    { title: 'Job A', date: '2025-01-01', status: 'Pending', description: 'Job A Description' },
    { title: 'Job B', date: '2025-01-02', status: 'Selected', description: 'Job B Description' },
    { title: 'Job C', date: '2025-01-03', status: 'Rejected', description: 'Job C Description' },
  ];

  const filteredApplications = filter === 'All' 
    ? allApplications 
    : allApplications.filter((app) => app.status === filter);

  const handleViewDetails = (job) => {
    setCurrentJob(job);
    setShowModal(true);
  };

  return (
    <div>
      <Header/>
    <div className="container mt-5">
      <h3 className="mb-3">Applications</h3>
      <ApplicationTabs setFilter={setFilter} />
      <div className="table-responsive">
        <ApplicationTable
          applications={filteredApplications}
          onViewDetails={handleViewDetails}
        />
      </div>
      {currentJob && (
        <JobDetailsModal
          show={showModal}
          onClose={() => setShowModal(false)}
          jobDetails={currentJob}
        />
      )}
    </div>
    </div>
  );
};

export default ApplicationSection;
