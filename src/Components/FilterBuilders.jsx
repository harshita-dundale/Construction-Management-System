// eslint-disable-next-line
function FilterBuilders({ filterLocation, setFilterLocation, sortOption, setSortOption }) {
  return (
    <div className="row mb-4">
      {/* Filter by Location */}
      <div className="col-md-6 d-flex justify-content-center mb-3 mb-md-0">
        <input
          type="text"
          className="form-control sort-input"
          placeholder="Filter by location"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        />
      </div>

      {/* Sort Options */}
      <div className="col-md-6 d-flex justify-content-center">
        <select
          className="form-select sort-input"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="none">Sort by</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBuilders;
