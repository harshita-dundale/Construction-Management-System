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
  deleteMaterial, // ✅ import
} from "../Redux/MaterialSlice";
import Swal from "sweetalert2";

const MaterialManagement = () => {
  const dispatch = useDispatch();
  const materials = useSelector((state) => state.materials.materials);
  const filter = useSelector((state) => state.materials.filter);
  const selectedProject = useSelector((state) => state.project.selectedProject);

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    quantity: 0,
    unitPrice: 0,
  });
  const [materialUsage, setMaterialUsage] = useState({
    name: "",
    quantityUsed: 0,
  });

  const [showAddMaterial, setShowAddMaterial] = useState(false);

  // ✅ Fetch project-specific materials
  const fetchMaterials = async () => {
    if (!selectedProject?._id) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/materials?projectId=${selectedProject._id}`
      );
      const data = await res.json();
      dispatch(setMaterials(data));
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [selectedProject]);

  // ✅ Add Material
  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (
      newMaterial.name &&
      newMaterial.quantity > 0 &&
      newMaterial.unitPrice > 0 &&
      selectedProject?._id
    ) {
      try {
        const res = await fetch("http://localhost:5000/api/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newMaterial, projectId: selectedProject._id }),
        });
        const data = await res.json();
        dispatch(addMaterial(data));
        setNewMaterial({ name: "", quantity: 0, unitPrice: 0 });
      } catch (err) {
        console.error("Add failed:", err);
      }
    }
  };

  // ✅ Update Usage
  const handleUpdateUsage = async (e) => {
    e.preventDefault();
    if (materialUsage.name && materialUsage.quantityUsed > 0) {
      try {
        const res = await fetch("http://localhost:5000/api/materials/usage", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(materialUsage),
        });
        const data = await res.json();
        dispatch(updateUsage(data));
        setMaterialUsage({ name: "", quantityUsed: 0 });
      } catch (err) {
        console.error("Usage update failed:", err);
      }
    }
  };

  // ✅ Delete Material
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This material will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
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

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1 className="text-center mb-5" style={{ marginTop: "8rem", color: "#333" }}>
          Material Management
        </h1>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search Materials"
            value={filter}
            onChange={(e) => dispatch(setFilter(e.target.value))}
          />
          <button
            className="btn btn-success"
            style={{ width: "20em" }}
            onClick={() => setShowAddMaterial(!showAddMaterial)}
          >
            {showAddMaterial ? "Hide Add Material" : "Add Material"}
          </button>
        </div>

        {showAddMaterial && (
          <form className="mb-4 p-4 border border-success rounded" onSubmit={handleAddMaterial}>
            <h5 className="text-success mb-3">Add New Material</h5>
            <div className="row">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Material Name"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Quantity"
                  value={newMaterial.quantity || ""}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, quantity: Number(e.target.value) })
                  }
                />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Unit Price"
                  value={newMaterial.unitPrice || ""}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, unitPrice: Number(e.target.value) })
                  }
                />
              </div>
              <div className="col-md-12 text-end mt-3">
                <button type="submit" className="btn btn-success">
                  Add
                </button>
              </div>
            </div>
          </form>
        )}

        <form className="mb-4 p-4 border border-warning rounded" onSubmit={handleUpdateUsage}>
          <h5 className="mb-3 text-warning">Update Material Usage</h5>
          <div className="row">
            <div className="col-md-6">
              <select
                className="form-control"
                value={materialUsage.name}
                onChange={(e) =>
                  setMaterialUsage({ ...materialUsage, name: e.target.value })
                }
              >
                <option value="">Select Material</option>
                {materials.map((mat) => (
                  <option key={mat._id} value={mat.name}>
                    {mat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Quantity Used"
                value={materialUsage.quantityUsed || ""}
                onChange={(e) =>
                  setMaterialUsage({ ...materialUsage, quantityUsed: Number(e.target.value) })
                }
              />
            </div>
            <div className="col-md-2 text-end">
              <button type="submit" className="btn btn-warning text-white">
                Update
              </button>
            </div>
          </div>
        </form>

        <div className="p-4 bg-light border border-info rounded">
          <h5 className="text-info">Material List</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Cost</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((mat) => (
                  <tr key={mat._id}>
                    <td>{mat.name}</td>
                    <td>{mat.quantity}</td>
                    <td>₹{mat.unitPrice.toFixed(2)}</td>
                    <td>₹{(mat.quantity * mat.unitPrice).toFixed(2)}</td>
                    <td>
                      <span
                        style={{ color: "red", cursor: "pointer", fontSize: "1.2rem" }}
                        title="Delete"
                        onClick={() => handleDelete(mat._id)}
                      >
                        🗑️
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No materials found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="text-start mt-3">
            <h5 className="fw-bold">Total Cost: ₹{totalCost.toFixed(2)}</h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialManagement;