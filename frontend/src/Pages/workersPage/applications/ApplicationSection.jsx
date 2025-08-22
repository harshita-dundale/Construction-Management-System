import React from 'react';
import ApplicationTabs from "./ApplicationTabs";
import ApplicationTable from "./ApplicationTable";
import JobDetailsModal from "./JobDetailsModal";
import Header from "../../../Components/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowModal,
  setCurrentJob,
  fetchApplications,
} from "../../Redux/applicationsSlice";
import { useEffect, useState } from "react";
//import { fetchApplications } from '../../Redux/AppliActionSlice';
import { useAuth0 } from "@auth0/auth0-react";

const ApplicationSection = () => {
  const dispatch = useDispatch();
  const { user } = useAuth0(); // get worker email
  const { activeTab } = useSelector((state) => state.appTabs);
  const { showModal, currentJob, loading } = useSelector((state) => state.applications);
  const [initialLoading, setInitialLoading] = useState(true);
  //const [statusFilter, setStatusFilter] = useState("all");
  //  const { showModal } = useSelector((state) => state.applicationsModel);

  const handleViewDetails = (job) => {
    dispatch(setCurrentJob(job));
    dispatch(setShowModal(true));
  };
  
  useEffect(() => {
    if (user?.email) {
      const normalizedStatus = activeTab === "All" ? null : activeTab;
  
      dispatch(fetchApplications({
        workerEmail: user.email,
        status: normalizedStatus,
      })).finally(() => setInitialLoading(false));
    }
  }, [dispatch, user?.email, activeTab]);  

  if (initialLoading || loading) {
    return (
      <>
        <Header />
        <div className="container mt-5">
          <div className="text-center" style={{ marginTop: "10rem" }}>
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Loading Applications...</h4>
            <p className="text-muted">Please wait while we fetch your job applications.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mt-5 pt-5">
        {/* <h3 className="mb-3">Applications</h3> */}
        <ApplicationTabs />
        <div className="table-responsive">
          <ApplicationTable
            onViewDetails={handleViewDetails}
            activeTab={activeTab}
          />
        </div>
        {showModal && <JobDetailsModal job={currentJob} />}
      </div>
    </div>
  );
};

export default ApplicationSection;
