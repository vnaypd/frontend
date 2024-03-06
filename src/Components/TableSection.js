// TableSection.js
import React from "react";

function TableSection({ tableData, sortColumn, sortOrder, handleHeaderClick }) {
  return (
    <table className="table-responsive">
      <thead>
        <tr>
          <th onClick={() => handleHeaderClick("State")}>State</th>
          <th onClick={() => handleHeaderClick("District")}>District</th>
          <th onClick={() => handleHeaderClick("Crop")}>Crop</th>
          <th onClick={() => handleHeaderClick("Year")}>Year</th>
          <th onClick={() => handleHeaderClick("Season")}>Season</th>
          <th onClick={() => handleHeaderClick("Area")}>Area</th>
          <th onClick={() => handleHeaderClick("Production")}>Production</th>
          <th onClick={() => handleHeaderClick("Yield")}>Yield</th>
        </tr>
        <tr>
          <th>{sortColumn === "State" && `Sorted by State (${sortOrder})`}</th>
          <th>
            {sortColumn === "District" && `Sorted by District (${sortOrder})`}
          </th>
          <th>{sortColumn === "Crop" && `Sorted by Crop (${sortOrder})`}</th>
          <th>{sortColumn === "Year" && `Sorted by Year (${sortOrder})`}</th>
          <th>
            {sortColumn === "Season" && `Sorted by Season (${sortOrder})`}
          </th>
          <th>{sortColumn === "Area" && `Sorted by Area (${sortOrder})`}</th>
          <th>
            {sortColumn === "Production" &&
              `Sorted by Production (${sortOrder})`}
          </th>
          <th>{sortColumn === "Yield" && `Sorted by Yield (${sortOrder})`}</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((item, index) => (
          <tr key={index}>
            <td>{item.State}</td>
            <td>{item.District}</td>
            <td>{item.Crop}</td>
            <td>{item.Year}</td>
            <td>{item.Season}</td>
            <td>{item.Area}</td>
            <td>{item.Production}</td>
            <td>{item.Yield}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableSection;
