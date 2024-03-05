// FilterSection.js
import React from "react";

function FilterSection({
  states,
  selectedState,
  handleStateChange,
  years,
  selectedYear,
  handleYearChange,
  crops,
  selectedCrop,
  handleCropChange,
  handleReset,
}) {
  return (
    <div className="filter-section">
      <label htmlFor="stateSelect">Select a State:</label>
      <select id="stateSelect" value={selectedState} onChange={handleStateChange}>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      <label htmlFor="yearSelect">Select a Year:</label>
      <select id="yearSelect" value={selectedYear} onChange={handleYearChange}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <label htmlFor="cropSelect">Select a Crop:</label>
      <select id="cropSelect" value={selectedCrop} onChange={handleCropChange}>
        {crops.map((crop) => (
          <option key={crop} value={crop}>
            {crop}
          </option>
        ))}
      </select>

      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default FilterSection;
