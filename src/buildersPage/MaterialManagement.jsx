import  { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MaterialManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    quantity: "",
    unitPrice: "",
  });
  const [materialUsage, setMaterialUsage] = useState({ name: "", quantityUsed: 0 });
  const [filter, setFilter] = useState("");

  // Add new material
  const addMaterial = () => {
    if (newMaterial.name && newMaterial.quantity > 0 && newMaterial.unitPrice > 0) {
      setMaterials([...materials, { ...newMaterial, id: Date.now() }]);
      setNewMaterial({ name: "", quantity: 0, unitPrice: 0 });
    }
  };
  // Update material usage
  const updateUsage = () => {
    const updatedMaterials = materials.map((material) =>
      material.name === materialUsage.name
        ? { ...material, quantity: material.quantity - materialUsage.quantityUsed }
        : material
    );
    setMaterials(updatedMaterials);
    setMaterialUsage({ name: "", quantityUsed: 0 });
  };

  // Filter materials by name
  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Material Management</h1>

      {/* Add Material Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Material</h5>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addMaterial();
            }}
          >
            <div className="row">
              <div className="col-md-4">
                <input  type="text"className="form-control" placeholder="Material Name"value={newMaterial.name}
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
                  value={newMaterial.quantity}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, quantity: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Unit Price"
                  value={newMaterial.unitPrice}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, unitPrice: e.target.value })
                  }
                />
              </div>
              <div className="col-md-12 text-end mt-3">
                <button type="submit" className="btn btn-primary">
                  Add Material
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Materials"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Material Usage Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Update Material Usage</h5>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUsage();
            }}
          >
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
                  {materials.map((material) => (
                    <option key={material.id} value={material.name}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Quantity Used"
                  value={materialUsage.quantityUsed}
                  onChange={(e) =>
                    setMaterialUsage({ ...materialUsage, quantityUsed: e.target.value })
                  }
                />
              </div>
              <div className="col-md-2 text-end">
                <button type="submit" className="btn btn-success">
                  Update Usage
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Material Table */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Material List</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((material) => (
                <tr key={material.id}>
                  <td>{material.name}</td>
                  <td>{material.quantity}</td>
                  <td>{material.unitPrice}</td>
                  <td>{material.quantity * material.unitPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaterialManagement;
