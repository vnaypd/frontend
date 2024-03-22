import React, { useState } from "react";

function Popup({ handleInsert, handleModify, handleRemove, crop_sort_id }) {
  return (
    <div className="popup">
      <button onClick={() => handleInsert(crop_sort_id)}>Insert</button>
      <button onClick={() => handleModify(crop_sort_id)}>Modify</button>
      <button onClick={() => handleRemove(crop_sort_id)}>Remove</button>
    </div>
  );
}

function TableSection({ tableData, sortColumn, sortOrder, handleHeaderClick }) {
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = (index) => {
    if (clickedRow === index) {
      // Toggle popup visibility
      setClickedRow(null);
    } else {
      setClickedRow(index);
    }
  };

  const handleInsert = (crop_sort_id) => {
    console.log("Insert at crop_sort_id:", crop_sort_id);
  };

  const handleModify = (crop_sort_id) => {
    console.log("Modify at crop_sort_id:", crop_sort_id);
  };

  const handleRemove = (crop_sort_id) => {
    console.log("Remove at crop_sort_id:", crop_sort_id);
  };

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
          <React.Fragment key={index}>
            <tr
              onClick={() => handleRowClick(index)} // Changed to handle click event
              style={{
                position: "relative",
              }}
            >
              <td>{item.State}</td>
              <td>{item.District}</td>
              <td>{item.Crop}</td>
              <td>{item.Year}</td>
              <td>{item.Season}</td>
              <td>{item.Area}</td>
              <td>{item.Production}</td>
              <td>{item.Yield}</td>
            </tr>
            {clickedRow === index && (
              <tr>
                <td colSpan="8">
                  <div className="popup">
                    {" "}
                    {/* Added popup container */}
                    <Popup
                      handleInsert={handleInsert}
                      handleModify={handleModify}
                      handleRemove={handleRemove}
                      crop_sort_id={item.crop_sort_id} // Pass crop_sort_id to Popup component
                    />
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default TableSection;
