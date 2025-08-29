import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../Components/Header";
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
  const [materialUsage, setMaterialUsage] = useState({
    name: "",
    quantityUsed: 0,
  });

  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch project-specific materials
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

  // Add Material
  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (
      newMaterial.name &&
      newMaterial.quantity > 0 &&
      newMaterial.unitPrice > 0 &&
      newMaterial.unit.trim() !== "" &&
      selectedProject?._id
    ) {
      // Check if material already exists in current project
      const existingMaterial = materials.find(
        mat => mat.name.toLowerCase().trim() === newMaterial.name.toLowerCase().trim()
      );

      if (existingMaterial) {
        const result = await Swal.fire({
          title: 'Material Already Exists',
          text: `"${newMaterial.name}" already exists. Do you want to add ${newMaterial.quantity} ${newMaterial.unit} to existing stock?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: 'var(--secondary-color)',
          cancelButtonColor: 'gray',
          confirmButtonText: 'Yes, add to stock',
          cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        // Update existing material quantity
        try {
          const updatedQty = existingMaterial.quantity + newMaterial.quantity;
          const res = await fetch(`http://localhost:5000/api/materials/usage`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: existingMaterial.name.trim(),
              quantityUsed: -(newMaterial.quantity), // Negative to add stock
              projectId: selectedProject._id,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            Swal.fire("Error", data.message || "Failed to update stock", "error");
            return;
          }

          dispatch(updateUsage(data));
          setNewMaterial({ name: "", quantity: 0, unitPrice: 0, unit: "" });
          Swal.fire("Success", `Added ${newMaterial.quantity} ${newMaterial.unit} to existing stock`, "success");
        } catch (err) {
          console.error("Update failed:", err);
          Swal.fire("Error", "Server error while updating stock", "error");
        }
        return;
      }

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
          if (data.message && data.message.includes('E11000')) {
            Swal.fire("Duplicate Material", `Material "${newMaterial.name}" already exists in this project. Please use a different name or update the existing material.`, "error");
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

  // Update Usage
  const [editMaterialId, setEditMaterialId] = useState(null);
  const [editedQty, setEditedQty] = useState(0);

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
        fetchMaterials(); // refresh
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
      <>
        <Header />
        <div className="container mt-5">
          <div className="text-center" style={{ marginTop: "10rem" }}>
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Loading Materials...</h4>
            <p className="text-muted">Please wait while we fetch material information.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="material-management-container">
        {/* Header Section */}
        <div className="material-header">
  <div className="container">
    <div className="row d-flex align-items-center pt-4">
      {/* Left Side: Heading, Subtitle */}
      <div className="col-md-8 ">
        <div className="mate-head-content">
          <h1 className="mate-head-title">Inventory Control</h1>
          <p className="mate-head-subtitle me-5">
          Efficiently track, manage, and optimize construction materials to reduce waste, control costs, and improve project productivity.
          </p>
          <span className="mate-head-badge mt-3">
            <i className="fas fa-boxes me-2"></i>
            Material Management
          </span>
        </div>
      </div>

      {/* Right Side: Stats */}
      <div className="col-md-4">
        <div className="header-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{filteredMaterials.length}</div>
              <div className="stat-label">Materials</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">₹{totalCost.toFixed(0)}</div>
              <div className="stat-label">Total Value</div>
            </div>
          </div>
        </div>
      </div>
      {/* Control Panel */}
      <div className="control-panel">
            <div className="row align-items-center">
              <div className="col-md-8 ">
                <div className="search-container ">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search materials by name..."
                    value={filter}
                    onChange={(e) => dispatch(setFilter(e.target.value))}
                  />
                </div>
              </div>
              <div className="col-md-4 text-end">
                <button
                  className="btn btn-add-material"
                  onClick={() => setShowAddMaterial(!showAddMaterial)}
                >
                  <i className={`fas ${showAddMaterial ? 'fa-minus' : 'fa-plus'} me-2`}></i>
                  {showAddMaterial ? "Hide Form" : "Add Material"}
                </button>
              </div>
            </div>
          </div>
    </div>
  </div>
</div>


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
            <div className="table-header">
              <h5 className="table-title">
                <i className="fas fa-list me-2"></i>
                Material Inventory
              </h5>
              <div className="table-summary">
                <span className="summary-item">
                  <i className="fas fa-cubes me-1"></i>
                  {filteredMaterials.length} Items
                </span>
                <span className="summary-item">
                  <i className="fas fa-rupee-sign me-1"></i>
                  ₹{totalCost.toFixed(2)} Total
                </span>
              </div>
            </div>
            
            {filteredMaterials.length > 0 ? (
              <div className="table-responsive mt-2">
                <table className="table modern-table">
                  <thead>
                    <tr>
                      <th><i className="fas fa-tag me-2"></i>Material Name</th>
                      <th><i className="fas fa-weight me-2"></i>Quantity</th>
                      <th><i className="fas fa-rupee-sign me-2"></i>Unit Price</th>
                      <th><i className="fas fa-calculator me-2"></i>Total Cost</th>
                      <th><i className="fas fa-cogs me-2"></i>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaterials.map((mat) => (
                      <tr key={mat._id} className="material-row">
                        <td>
                          <div className="material-name">
                            <div className="material-icon">
                              <i className="fas fa-cube"></i>
                            </div>
                            <span className="name-text">{mat.name}</span>
                          </div>
                        </td>
                        <td>
                          {editMaterialId === mat._id ? (
                            <div className="edit-quantity">
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                value={
                                  editedQty === null || editedQty === undefined
                                    ? ""
                                    : editedQty
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditedQty(val === "" ? "" : Number(val));
                                }}
                              />
                            </div>
                          ) : (
                            <div className="quantity-display">
                              <span className="quantity-number">{mat.quantity}</span>
                              <span className="quantity-unit">{mat.unit}</span>
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="price-display">₹{mat.unitPrice.toFixed(2)}</span>
                        </td>
                        <td>
                          <span className="cost-display">₹{(mat.quantity * mat.unitPrice).toFixed(2)}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {editMaterialId === mat._id ? (
                              <>
                                <button
                                  className="btn btn-sm btn-success me-1"
                                  onClick={() => handleSaveEdit(mat)}
                                  title="Save Changes"
                                >
                                  <MdOutlineSaveAlt />
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => {
                                    setEditMaterialId(null);
                                    setEditedQty(null);
                                  }}
                                  title="Cancel"
                                >
                                  <TbCancel />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  onClick={() => {
                                    setEditMaterialId(mat._id);
                                    setEditedQty(mat.quantity);
                                  }}
                                  title="Edit Quantity"
                                >
                                  <MdEdit />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(mat._id)}
                                  title="Delete Material"
                                >
                                  <RiDeleteBin6Line />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-boxes"></i>
                </div>
                <h4 className="empty-title">No Materials Found</h4>
                <p className="empty-description">
                  {filter ? `No materials match "${filter}"` : "Start by adding your first material to the inventory"}
                </p>
                {!filter && (
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={() => setShowAddMaterial(true)}
                  >
                    <i className="fas fa-plus me-2"></i>
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