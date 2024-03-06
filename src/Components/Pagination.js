import React from "react";

function Pagination({
  pageSize,
  totalPages,
  pageInput,
  handlePageInputChange,
  handlePageInputSubmit,
  setPageSize,
}) {
  return (
    <div className="pagination">
      <label htmlFor="pageSizeSelect">Select Page Size:</label>
      <select
        id="pageSizeSelect"
        value={pageSize}
        onChange={(e) => setPageSize(parseInt(e.target.value))}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <label htmlFor="pageNumber">Enter Page Number:</label>
      <input
        type="text"
        id="pageNumber"
        value={pageInput}
        onChange={handlePageInputChange}
      />
      <button onClick={handlePageInputSubmit}>Go</button>
      <span>of {totalPages} pages</span>
    </div>
  );
}

export default Pagination;
