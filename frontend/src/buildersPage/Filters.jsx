
const Filters = ({ type }) => (
  
 
 <div className="filters">
    <h3>Filters</h3>
    {type === "application" ? (
      <>
        <label>
          Status:
          <select>
            <option value="all">All</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <label>
          Skills:
          <input type="text" placeholder="Search skills" />
        </label>
        <label>
          Experience:
          <input type="number" min="0" max="30" placeholder="Years" />
        </label>
      </>
    ) : (
      <label>
        Search:
        <input type="text" placeholder="Search cart items" />
      </label>
    )}
  </div>
);

export default Filters;
