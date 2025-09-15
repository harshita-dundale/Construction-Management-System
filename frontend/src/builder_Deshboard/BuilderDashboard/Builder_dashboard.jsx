import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import ProjectModal from "../../Components/ProjectModal";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import ProjectList from "./ProjectList";
import { Button } from 'react-bootstrap';
import { selectProject, updateProject, deleteProject, fetchProjects } from "../../Pages/Redux/projectSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAuth0 } from "@auth0/auth0-react";
import "./Builder_dashboard.css";

function Builder_dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const cardData1 = useSelector((state) => state.builder.cards);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(3);
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const projects = useSelector((state) => state.project.projects);
  const materials = useSelector((state) => state.materials.materials);
  const payrollList = useSelector((state) => state.Payroll.payrollList);
  const { user } = useAuth0();

  const [enhancedPayrollTotal, setEnhancedPayrollTotal] = useState(0);
  const [editingProject, setEditingProject] = useState(null);
  const [editProjectData, setEditProjectData] = useState({
    name: "",
    type: "",
    location: "",
    clientName: "",
    phoneNumber: "",
    email: "",
    startDate: "",
    expectedEndDate: "",
    expectedCost: ""
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [flippedProject, setFlippedProject] = useState(null);

  // Dynamic dashboard stats
  const [ongoingWorkers, setOngoingWorkers] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);

  const totalPages = Math.ceil((projects?.length || 0) / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;

  // Calculate dynamic stats
  const totalProjects = projects?.length || 0;
  const totalMaterialExpenses = Array.isArray(materials)
    ? materials.reduce((sum, m) => sum + (m.unitPrice * (m.quantity || 1)), 0)
    : 0;

  // Fetch ongoing workers across all projects
  useEffect(() => {
    const fetchOngoingWorkers = async () => {
      if (!user?.sub || !projects?.length) {
        setOngoingWorkers(0);
        return;
      }

      try {
        let totalWorkers = 0;
        for (const project of projects) {
          const res = await fetch(
            `http://localhost:5000/api/apply?status=joined&projectId=${project._id}`
          );
          if (res.ok) {
            const data = await res.json();
            const joinedWorkers = data.filter((app) => app.status === "joined");
            totalWorkers += joinedWorkers.length;
          }
        }
        setOngoingWorkers(totalWorkers);
      } catch (err) {
        console.error("Error fetching ongoing workers:", err);
        setOngoingWorkers(0);
      }
    };

    fetchOngoingWorkers();
  }, [projects, user?.sub]);

  useEffect(() => {
    const fetchPendingPayments = async () => {
      if (!user?.sub || !projects?.length) {
        setPendingPayments(0);
        return;
      }

      try {
        let totalPending = 0;
        for (const project of projects) {
          const res = await fetch(
            `http://localhost:5000/api/apply?status=joined&projectId=${project._id}`
          );
          if (res.ok) {
            const data = await res.json();
            const joinedWorkers = data.filter((app) => app.status === "joined");

            for (const worker of joinedWorkers) {
              const salary = worker.jobId?.salary || 0;
              const workerId = worker.userId?._id || worker._id;
              
              try {
                const attendanceRes = await fetch(
                  `http://localhost:5000/api/worker-records/history/${workerId}`
                );
                if (attendanceRes.ok) {
                  const history = await attendanceRes.json();
                  const presentCount = history.filter(h => h.status === "Present").length;
                  totalPending += presentCount * salary;
                }
              } catch (err) {
                console.error("Error fetching worker attendance:", err);
              }
            }
          }
        }
        setPendingPayments(totalPending);
      } catch (err) {
        console.error("Error calculating pending payments:", err);
        setPendingPayments(0);
      }
    };

    fetchPendingPayments();
  }, [projects, user?.sub]);

  useEffect(() => {
    const updateProjectsPerPage = () => {
      if (window.innerWidth < 576) {
        setProjectsPerPage(1);
      } else if (window.innerWidth < 992) {
        setProjectsPerPage(2);
      } else {
        setProjectsPerPage(3);
      }
    };
    updateProjectsPerPage();
    window.addEventListener("resize", updateProjectsPerPage);
    return () => window.removeEventListener("resize", updateProjectsPerPage);
  }, []);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    const saved = localStorage.getItem("selectedProject");
    if (saved && !selectedProject) {
      dispatch(selectProject(JSON.parse(saved)));
    }
  }, [selectedProject]);

  useEffect(() => {
    const selected = localStorage.getItem("selectedProject");
    if (!selected) {
      setShowProjectModal(true);
    }
  }, []);

  useEffect(() => {
    if (location.state && location.state.showProjectModal) {
      setShowProjectModal(true);
    }
  }, [location]);

  useEffect(() => {
    if (selectedProject) {
      setShowProjectModal(false);
    }
  }, [selectedProject]);

  useEffect(() => {
    const fetchEnhancedPayrollData = async () => {
      if (!selectedProject?._id) {
        setEnhancedPayrollTotal(0);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/apply?status=joined&projectId=${selectedProject._id}`
        );
        if (!res.ok) return;
        const data = await res.json();
        const hired = data.filter((app) => app.status === "joined");

        let totalPayable = 0;
        for (const worker of hired) {
          const salary = worker.jobId?.salary || 0;
          const workerId = worker.userId?._id || worker._id;

          try {
            const sumRes = await fetch(
              `http://localhost:5000/api/worker-records/history/${workerId}`
            );
            const history = await sumRes.json();
            const presentCount = history.filter(h => h.status === "Present").length;
            totalPayable += presentCount * salary;
          } catch (err) {
            console.error("Error fetching attendance:", err);
          }
        }
        setEnhancedPayrollTotal(totalPayable);
      } catch (err) {
        console.error("Error fetching enhanced payroll data:", err);
        setEnhancedPayrollTotal(0);
      }
    };

    fetchEnhancedPayrollData();
  }, [selectedProject]);

  const totalMaterialCost = Array.isArray(materials)
    ? materials.reduce((sum, m) => sum + (m.unitPrice * (m.quantity || 1)), 0)
    : 0;
  const totalWorkerPayable = Array.isArray(payrollList)
    ? payrollList.reduce((sum, p) => sum + (p.totalSalary || p.payable || 0), 0)
    : 0;
  const totalProjectCost = totalMaterialCost + totalWorkerPayable + enhancedPayrollTotal;

  return (
    <>
    <Header />
     <DashboardHeader
  title="Project Management Hub"
  subtitle="Streamline your projects with advanced tools. Monitor attendance, payments, and progress instantly. Organize workers and job roles without hassle."
  actions={
    <Button onClick={() => setShowProjectModal(true)} className="btn-dashboard-primary">
      <i className="fas fa-cog me-2"></i> Add Projects
    </Button>
  }
/>
<Sidebar />
    <div className="dashboard-wrapper">
      <DashboardStats
        totalProjects={totalProjects}
        ongoingWorkers={ongoingWorkers}
        totalMaterialExpenses={totalMaterialExpenses}
        pendingPayments={pendingPayments}
      />
      <ProjectList
        projects={projects}
        selectedProject={selectedProject}
        indexOfFirstProject={indexOfFirstProject}
        indexOfLastProject={indexOfLastProject}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        setShowProjectModal={setShowProjectModal}
        onProjectUpdate={() => dispatch(fetchProjects(user?.sub))}
      />
     
      
      <ProjectModal
        show={showProjectModal}
        handleClose={() => {
          if (!selectedProject) {
            toast.warning("Please select a project before closing.", {
              position: "top-right",
              autoClose: 3000,
            });
          } else {
            setShowProjectModal(false);
          }
        }}
      />
    </div>
    </>
  );
}

export default Builder_dashboard;