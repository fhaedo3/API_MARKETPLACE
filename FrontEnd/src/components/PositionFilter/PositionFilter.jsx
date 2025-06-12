import React from 'react';
import './PositionFilter.css';

const PositionFilter = ({ positions, selectedPosition, onChange }) => {
  return (
    <div className="position-filter-container">
      <label htmlFor="position-filter" className="position-filter-label">
        Filter by Position:
      </label>
      <select
        id="position-filter"
        value={selectedPosition}
        onChange={(e) => onChange(e.target.value)}
        className="position-filter-select"
      >
        <option value="">All Positions</option>
        {positions.map((pos, i) => (
          <option key={i} value={pos}>{pos}</option>
        ))}
      </select>
    </div>
  );
};

export default PositionFilter;