import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import "./material.css";
import {
  addMaterial,
  updateUsage,
  setFilter,
  setMaterials,
  deleteMaterial,
} from "../Redux/MaterialSlice";
import Swal from "sweetalert2";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineSaveAlt } from "react-icons/md";
import { TbCancel } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import DashboardHeader from '../../builder_Deshboard/BuilderDashboard/DashboardHeader'
import LoadingSpinner from '../../Components/LoadingSpinner'

const MaterialManagement = () => {
  const dispatch = useDispatch();
  const materials = useSelector((state) => state.materials.materials);
  const filter = useSelector((state) => state.materials.filter);
  const selectedProject = useSelector((state) => state.project.selectedProject);

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    quantity: 0,
    unitPrice: 0,
    unit: "",
  });

  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editMaterialId, setEditMaterialId] = useState(null);
  const [editedQty, setEditedQty] = useState(0);

  // 🔹 Fetch project-specific materials
  const fetchMaterials = async () => {
    if (!selectedProject?._id) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/materials?projectId=${selectedProject._id}`
      );
      const data = await res.json();
      dispatch(setMaterials(data));
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [selectedProject]);

  // 🔹 Add Material
  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!selectedProject?._id) {
      Swal.fire("Error", "No project selected! Please select a project first.", "error");
      return;
    }

    if (
      newMaterial.name &&
      newMaterial.quantity > 0 &&
      newMaterial.unitPrice > 0 &&
      newMaterial.unit.trim() !== ""
    ) {
      try {
        const res = await fetch("http://localhost:5000/api/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newMaterial,
            name: newMaterial.name.trim(),
            projectId: selectedProject._id,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 409) {
            const result = await Swal.fire({
              title: 'Material Already Exists in This Project',
              text: `"${newMaterial.name}" already exists. Add ${newMaterial.quantity} ${newMaterial.unit}?`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: 'var(--secondary-color)',
              cancelButtonColor: 'gray',
              confirmButtonText: 'Yes, add to stock',
              cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed && data.existingMaterial) {
              try {
                const updateRes = await fetch(`http://localhost:5000/api/materials/usage`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: data.existingMaterial.name,
                    quantityUsed: -(newMaterial.quantity),
                    projectId: selectedProject._id,
                  }),
                });

                const updateData = await updateRes.json();
                if (updateRes.ok) {
                  dispatch(updateUsage(updateData));
                  setNewMaterial({ name: "", quantity: 0, unitPrice: 0, unit: "" });
                  Swal.fire("Success", `Added ${newMaterial.quantity} ${newMaterial.unit} to existing stock`, "success");
                } else {
                  Swal.fire("Error", updateData.message || "Failed to update stock", "error");
                }
              } catch (err) {
                Swal.fire("Error", "Failed to update existing material", "error");
              }
            }
          } else {
            Swal.fire("Error", data.message || "Material add failed", "error");
          }
          return;
        }

        dispatch(addMaterial(data));
        setNewMaterial({ name: "", quantity: 0, unitPrice: 0, unit: "" });
        Swal.fire("Success", "Material added successfully", "success");
      } catch (err) {
        console.error("Add failed:", err);
        Swal.fire("Error", "Server error while adding material", "error");
      }
    }
  };

  // 🔹 Update Usage
  const handleSaveEdit = async (mat) => {
    if (editedQty === "" || isNaN(editedQty)) {
      Swal.fire("Invalid Input", "Quantity cannot be empty", "warning");
      return;
    }

    const qtyUsed = mat.quantity - editedQty;
    if (isNaN(qtyUsed) || qtyUsed < 0) {
      alert("Invalid quantity update");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/materials/usage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: mat.name.trim(),
          quantityUsed: qtyUsed,
          projectId: selectedProject._id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        Swal.fire("Error", data.message || "Update failed", "error");
        return;
      }

      dispatch(updateUsage(data));
      setEditMaterialId(null);
      setEditedQty(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // 🔹 Delete Material
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This material will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--secondary-color)",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/materials/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        dispatch(deleteMaterial(id));
        Swal.fire("Deleted!", "Material has been removed.", "success");
        fetchMaterials(); 
      } else {
        Swal.fire("Error", "Failed to delete material.", "error");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire("Error", "Server error occurred while deleting.", "error");
    }
  };

  const filteredMaterials = materials.filter((mat) =>
    mat.name.toLowerCase().includes(filter.toLowerCase())
  );

  const totalCost = filteredMaterials.reduce(
    (acc, mat) => acc + mat.quantity * mat.unitPrice,
    0
  );

  if (loading) {
    return (
      <LoadingSpinner
        loading={loading}
        title="Loading Materials..."
        subtitle="Please wait while we prepare your material list."
        spinnerColor="text-success"
      />
    );
  }

  return (
    <>
      <Header />
      <Sidebar />
      <DashboardHeader
        title="Inventory Control"
        subtitle="Efficiently track, manage, and optimize construction materials to reduce waste, control costs, and improve project productivity."
        stats={[
          { number: filteredMaterials.length, label: "Materials" },
          { number: `₹${totalCost.toFixed(0)}`, label: "Total Value" },
        ]}
      />

      <div className="material-management-container">
        <div className="container">

          {/* Add Material Form */}
          {showAddMaterial && (
            <div className="add-material-card mt-4">
              <form onSubmit={handleAddMaterial}>
                <div className="form-header ">
                  <h5 className="form-title">
                    <i className="fas fa-plus-circle me-2"></i>
                    Add New Material
                  </h5>
                </div>
                <div className="form-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Material Name</label>
                      <input
                        type="text"
                        className="form-control modern-input"
                        placeholder="Enter material name"
                        value={newMaterial.name}
                        onChange={(e) =>
                          setNewMaterial({ ...newMaterial, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        className="form-control modern-input"
                        placeholder="0"
                        value={newMaterial.quantity || ""}
                        onChange={(e) =>
                          setNewMaterial({
                            ...newMaterial,
                            quantity: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Unit</label>
                      <input
                        type="text"
                        className="form-control modern-input"
                        placeholder="kg, liter, etc."
                        value={newMaterial.unit}
                        onChange={(e) =>
                          setNewMaterial({ ...newMaterial, unit: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Unit Price (₹)</label>
                      <input
                        type="number"
                        className="form-control modern-input"
                        placeholder="0.00"
                        step="0.01"
                        value={newMaterial.unitPrice || ""}
                        onChange={(e) =>
                          setNewMaterial({
                            ...newMaterial,
                            unitPrice: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 d-flex align-items-end">
                      <button type="submit" className="btn btn-submit w-100">
                        <IoMdAdd className="me-2" />
                        Add Material
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Materials Table */}
          <div className="materials-table-card mt-4">
            <div className="table-header d-flex justify-content-between align-items-center mb-2">
              <div className="search-containers">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search materials..."
                    value={filter}
                    onChange={(e) => dispatch(setFilter(e.target.value))}
                  />
                </div>
              </div>
              <button
                className="btn btn-add-material"
                onClick={() => setShowAddMaterial(!showAddMaterial)}
              >
                <i className={`fas ${showAddMaterial ? "fa-minus" : "fa-plus"} me-2`}></i>
                {showAddMaterial ? "Hide Form" : "Add Material"}
              </button>
            </div>

            {filteredMaterials.length > 0 ? (
              <div className="table-responsive">
                <table className="table modern-table">
                  <thead>
                    <tr>
                      <th>Material Name</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total Cost</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaterials.map((mat) => (
                      <tr key={mat._id}>
                        <td>{mat.name}</td>
                        <td>
                          {editMaterialId === mat._id ? (
                            <input
                              type="number"
                              value={editedQty}
                              onChange={(e) => setEditedQty(Number(e.target.value))}
                            />
                          ) : (
                            `${mat.quantity} ${mat.unit}`
                          )}
                        </td>
                        <td>₹{mat.unitPrice.toFixed(2)}</td>
                        <td>₹{(mat.quantity * mat.unitPrice).toFixed(2)}</td>
                        <td>
                          {editMaterialId === mat._id ? (
                            <>
                              <button onClick={() => handleSaveEdit(mat)}>
                                <MdOutlineSaveAlt />
                              </button>
                              <button onClick={() => setEditMaterialId(null)}>
                                <TbCancel />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditMaterialId(mat._id); setEditedQty(mat.quantity); }}>
                                <MdEdit />
                              </button>
                              <button onClick={() => handleDelete(mat._id)}>
                                <RiDeleteBin6Line />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state text-center mt-4">
                <h5>No Materials Found</h5>
                {!filter && (
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => setShowAddMaterial(true)}
                  >
                    Add First Material
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialManagement;