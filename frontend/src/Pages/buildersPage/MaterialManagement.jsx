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
      newMaterial.unit.trim() !== "" &&
      selectedProject?._id
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
      //  console.log("Added Material Response:", data);

        if (!res.ok) {
          Swal.fire("Error", data.message || "Material add failed", "error");
          return;
        }

        dispatch(addMaterial(data));
        setNewMaterial({ name: "", quantity: 0, unitPrice: 0, unit: "" });
      } catch (err) {
        console.error("Add failed:", err);
        Swal.fire("Error", "Server error while adding material", "error");
      }
    }
  };

  // ✅ Update Usage
  const [editMaterialId, setEditMaterialId] = useState(null);
  const [editedQty, setEditedQty] = useState(0);

  const handleSaveEdit = async (mat) => {
    if (editedQty === "" || isNaN(editedQty)) {
      Swal.fire("Invalid Input", "Quantity cannot be empty", "warning");
      return;
    }

    // const quantityUsed = mat.quantity - editedQty;
    // if (quantityUsed < 0) {
    //   Swal.fire(
    //     "Invalid Input",
    //     "New quantity cannot be more than existing",
    //     "warning"
    //   );
    //   return;
    // }
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
        <h1
          className="text-center mb-5"
          style={{ marginTop: "8rem", color: "#333" }}
        >
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
          <form
            className="mb-4 p-4 border border-success rounded"
            onSubmit={handleAddMaterial}
          >
            <h5 className="text-success mb-3">Add New Material</h5>
            <div className="row">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Material Name"
                  value={newMaterial.name}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, name: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Quantity"
                  value={newMaterial.quantity || ""}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Unit (e.g. kg, liter)"
                  value={newMaterial.unit}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, unit: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4 mt-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Unit Price"
                  value={newMaterial.unitPrice || ""}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      unitPrice: Number(e.target.value),
                    })
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
        <div className="p-4 bg-light border border-info rounded">
          <h5 className="text-info">Material List</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Cost</th>
                <th>Actions</th>
                {/* <th>Edit</th>
                <th>Delete</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((mat) => (
                  <tr key={mat._id}>
                    <td>{mat.name.trim()}</td>

                    {/* Quantity Cell */}
                    <td>
                      {editMaterialId === mat._id ? (
                        <input
                          type="number"
                          className="form-control"
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
                      ) : (
                        `${mat.quantity} ${mat.unit}`
                      )}
                    </td>
                    {/* Unit Price */}
                    <td>₹{mat.unitPrice.toFixed(2)}</td>
                    {/* Cost */}
                    <td>₹{(mat.quantity * mat.unitPrice).toFixed(2)}</td>

                    {/* Actions */}
                    <td>
                      {editMaterialId === mat._id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleSaveEdit(mat)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              setEditMaterialId(null);
                              setEditedQty(null);
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            style={buttonStyle}
                            onClick={() => {
                              setEditMaterialId(mat._id);
                              setEditedQty(mat.quantity);
                            }}
                          >
                            Edit
                          </button>
                          {/* <span */}
                          <button
                            // style={{
                            //   color: "red",
                            //   cursor: "pointer",
                            //   fontSize: "1.2rem",
                            // }}
                            className="btn btn-sm btn-danger"
                            title="Delete"
                            onClick={() => handleDelete(mat._id)}
                          >
                            {/* 🗑️ */} Delete
                            </button>
                          {/* </span> */}
                        </>
                      )}
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
const buttonStyle = {
  backgroundColor: "var(--primary-color)",
  transition: "background-color 0.3s ease, color 0.3s ease",
  color: "var(--text-color)",
}