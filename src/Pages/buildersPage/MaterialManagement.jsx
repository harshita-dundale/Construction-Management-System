import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMaterial, updateUsage, setFilter } from "../Redux/MaterialSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../Components/Header";
import "./material.css"; 

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

  const [showAddMaterial, setShowAddMaterial] = useState(false); // Toggle state

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (newMaterial.name && newMaterial.quantity > 0 && newMaterial.unitPrice > 0) {
      dispatch(addMaterial(newMaterial));
      setNewMaterial({ name: "", quantity: 0, unitPrice: 0 });
    }
  };

  // Update material usage
  const handleUpdateUsage = (e) => {
    e.preventDefault();
    if (materialUsage.name && materialUsage.quantityUsed > 0) {
      dispatch(updateUsage(materialUsage));
      setMaterialUsage({ name: "", quantityUsed: 0 });
    }
  };

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(filter.toLowerCase())
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
            style={sortInput} 
            placeholder="Search Materials"
            value={filter}
            onChange={(e) => dispatch(setFilter(e.target.value))}
          />
          <button className="btn btn-success" style={{width: "20em"}} onClick={() => setShowAddMaterial(!showAddMaterial)}>
            {showAddMaterial ? "Hide Add Material" : "Add Material"}
          </button>
        </div>

        {showAddMaterial && (
          <div className="mb-4 p-4" style={{ border: "2px solid #2ECC71", borderRadius: "10px" }}>
            <h5 className="text-success mb-3">Add New Material</h5>
            <form onSubmit={handleAddMaterial}>
              <div className="row">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Material Name"
                    style={{ fontStyle: "italic" }}
                    value={newMaterial.name}
                    onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Quantity"
                    style={{ fontStyle: "italic" }}
                    value={newMaterial.quantity === 0 ? "" : newMaterial.quantity}
                    onChange={(e) => setNewMaterial({ ...newMaterial, quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Unit Price"
                    style={{ fontStyle: "italic" }}
                    value={newMaterial.unitPrice === 0 ? "" : newMaterial.unitPrice}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unitPrice: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="col-md-12 text-end mt-3">
                  <button type="submit" className="btn btn-success">Add Material</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Update Material Usage */}
        <div className="mb-4 p-4" style={{ border: "2px solid #F39C12", borderRadius: "10px" }}>
          <h5 className="mb-3" style={{ color: "orange" }}>Update Material Usage</h5>
          <form onSubmit={handleUpdateUsage}>
            <div className="row">
              <div className="col-md-6">
                <select
                  className="form-control"
                  value={materialUsage.name}
                  onChange={(e) => setMaterialUsage({ ...materialUsage, name: e.target.value })}
                >
                  <option value="">Select Material</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.name}>{material.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Quantity Used"
                  style={{ fontStyle: "italic" }}
                  value={materialUsage.quantityUsed === 0 ? "" : materialUsage.quantityUsed}
                  onChange={(e) => setMaterialUsage({ ...materialUsage, quantityUsed: Number(e.target.value) })}
                />
              </div>
              <div className="col-md-2 text-end">
                <button type="submit" style={{ backgroundColor: "#F39C12" }} className="btn text-white">
                  Update Usage
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Material Table */}
        <div className="p-4 bg-light" style={{ border: "2px solid rgb(46, 199, 204)", borderRadius: "10px" }}>
          <h5 className="text-info">Material List</h5>
          <table className="table table-striped table-bordered">
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
                filteredMaterials.map((material) => (
                  <tr key={material.id}>
                    <td>{material.name}</td>
                    <td>{material.quantity}</td>
                    <td>${material.unitPrice.toFixed(2)}</td>
                    <td>${(material.quantity * material.unitPrice).toFixed(2)}</td>
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


const sortInput  = {
	width: '90%',
	height: '37px', 
	// borderRadius: '25px', 
	border: '1px solid #ced4da',
	boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
	borderColor:' #007bff',
	padding: '10px',
paddingLeft : '1rem'

};
  