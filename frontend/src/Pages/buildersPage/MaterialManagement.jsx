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
} from "../Redux/MaterialSlice";
const MaterialManagement = () => {
  const dispatch = useDispatch();
  const materials = useSelector((state) => state.materials.materials);
  const filter = useSelector((state) => state.materials.filter);
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

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/materials");
        const data = await res.json();
        dispatch(setMaterials(data));
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchMaterials();
  }, [dispatch]);

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (newMaterial.name && newMaterial.quantity > 0 && newMaterial.unitPrice > 0) {
      try {
        const res = await fetch("http://localhost:5000/api/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMaterial),
        });
        const data = await res.json();
        dispatch(addMaterial(data));
        setNewMaterial({ name: "", quantity: 0, unitPrice: 0 });
      } catch (err) {
        console.error("Add failed:", err);
      }
    }
  };

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

  const filteredMaterials = materials.filter((mat) =>
    mat.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1 className="text-center mb-5" style={{ marginTop: "7rem", color: "#333" }}>
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
                  onChange={(e) => setNewMaterial({ ...newMaterial, quantity: Number(e.target.value) })}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Unit Price"
                  value={newMaterial.unitPrice || ""}
                  onChange={(e) => setNewMaterial({ ...newMaterial, unitPrice: Number(e.target.value) })}
                />
              </div>
              <div className="col-md-12 text-end mt-3">
                <button type="submit" className="btn btn-success">Add</button>
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
                onChange={(e) => setMaterialUsage({ ...materialUsage, name: e.target.value })}
              >
                <option value="">Select Material</option>
                {materials.map((mat) => (
                  <option key={mat._id} value={mat.name}>{mat.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Quantity Used"
                value={materialUsage.quantityUsed || ""}
                onChange={(e) => setMaterialUsage({ ...materialUsage, quantityUsed: Number(e.target.value) })}
              />
            </div>
            <div className="col-md-2 text-end">
              <button type="submit" className="btn btn-warning text-white">Update</button>
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
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((mat) => (
                  <tr key={mat._id}>
                    <td>{mat.name}</td>
                    <td>{mat.quantity}</td>
                    <td>${mat.unitPrice.toFixed(2)}</td>
                    <td>${(mat.quantity * mat.unitPrice).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No materials found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MaterialManagement;