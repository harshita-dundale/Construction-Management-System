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
import { useEffect } from "react"; //, useState
//import { fetchApplications } from '../../Redux/AppliActionSlice';
import { useAuth0 } from "@auth0/auth0-react";

const ApplicationSection = () => {
  const dispatch = useDispatch();
  const { user } = useAuth0(); // get worker email
  const { activeTab } = useSelector((state) => state.appTabs);
  const { showModal, currentJob } = useSelector((state) => state.applications);
  //const [statusFilter, setStatusFilter] = useState("all");
  //  const { showModal } = useSelector((state) => state.applicationsModel);

  const handleViewDetails = (job) => {
    dispatch(setCurrentJob(job));
    dispatch(setShowModal(true));
  };
  
  useEffect(() => {
    if (user?.email) {
     // console.log("📨 activeTab:", activeTab);
      //console.log("📨 email to thunk:", user.email);
  
      const normalizedStatus = activeTab === "All" ? null : activeTab;
  
     // console.log("📨 Dispatching email to thunk:", user.email);
     // console.log("📨 Sending status:", normalizedStatus);
  
      dispatch(fetchApplications({
        workerEmail: user.email,
        status: normalizedStatus,
      }));
    }
  }, [dispatch, user?.email, activeTab]);  

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
