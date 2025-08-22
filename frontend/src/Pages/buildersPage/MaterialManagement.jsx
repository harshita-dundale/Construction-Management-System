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
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="header-content">
                  <div className="header-badge mb-2">
                    <i className="fas fa-boxes me-2"></i>
                    Material Management
                  </div>
                  <h1 className="header-title">Inventory Control</h1>
                  <p className="header-subtitle">
                    Track, manage, and optimize your construction materials
                  </p>
                </div>
              </div>
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
            </div>
          </div>
        </div>

        <div className="container">
          {/* Control Panel */}
          <div className="control-panel">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="search-container">
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

          {/* Add Material Form */}
          {showAddMaterial && (
            <div className="add-material-card">
              <form onSubmit={handleAddMaterial}>
                <div className="form-header">
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
          <div className="materials-table-card">
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
      
      {/* Enhanced Styles */}
      <style jsx>{`
        .material-management-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .material-header {
          background: white;
          padding: 2rem 0;
          margin-top: 6rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .header-title {
          font-size: 3rem;
          font-weight: 800;
          color: #2c3e50;
          margin: 0.5rem 0;
        }
        
        .header-subtitle {
          font-size: 1.2rem;
          color: #6c757d;
          margin: 0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .stat-item {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem;
          border-radius: 10px;
          text-align: center;
        }
        
        .stat-number {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.8rem;
          opacity: 0.9;
        }
        
        .control-panel {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin: 2rem 0;
        }
        
        .search-container {
          position: relative;
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          z-index: 2;
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 2px solid #e9ecef;
          border-radius: 25px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          outline: none;
        }
        
        .btn-add-material {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-add-material:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          color: white;
        }
        
        .add-material-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          overflow: hidden;
        }
        
        .form-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
        }
        
        .form-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .form-body {
          padding: 2rem;
        }
        
        .modern-input {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 0.75rem;
          transition: all 0.3s ease;
        }
        
        .modern-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .btn-submit {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3);
          color: white;
        }
        
        .materials-table-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .table-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .table-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .table-summary {
          display: flex;
          gap: 1rem;
        }
        
        .summary-item {
          font-size: 0.9rem;
          opacity: 0.9;
        }
        
        .modern-table {
          margin: 0;
        }
        
        .modern-table thead th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          padding: 1rem;
          font-weight: 600;
          color: white;
          border-bottom: 2px solid #667eea;
        }
        
        .material-row {
          transition: all 0.3s ease;
        }
        
        .material-row:hover {
          background: rgba(102, 126, 234, 0.05);
        }
        
        .material-row td {
          padding: 1rem;
          vertical-align: middle;
        }
        
        .material-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .material-icon {
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.9rem;
        }
        
        .name-text {
          font-weight: 600;
          color: #2c3e50;
        }
        
        .quantity-display {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .quantity-number {
          font-weight: 700;
          font-size: 1.1rem;
          color: #2c3e50;
        }
        
        .quantity-unit {
          font-size: 0.8rem;
          color: #6c757d;
        }
        
        .price-display,
        .cost-display {
          font-weight: 600;
          color: #11998e;
        }
        
        .action-buttons {
          display: flex;
          gap: 0.25rem;
          justify-content: center;
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }
        
        .empty-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          font-size: 3rem;
          color: white;
        }
        
        .empty-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .empty-description {
          color: #6c757d;
          font-size: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }
        
        @media (max-width: 768px) {
          .header-title {
            font-size: 2rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .table-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .table-summary {
            justify-content: center;
          }
          
          .material-name {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};

export default MaterialManagement;