import React, { useState, useEffect } from "react";
import axios from "axios";
import FilterSection from "./FilterSection";
import ChartSection from "./ChartSection";
import TableSection from "./TableSection";
import Pagination from "./Pagination";
import LoadingOverlay from "./LoadingOverlay";
import "../App.css";
function Main() {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const [states, setStates] = useState([
    "Select State",
    "Delhi",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ]);
  const [selectedState, setSelectedState] = useState("Select State");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [prodPerCropData, setProdPerCropData] = useState([]);
  const [prodPerYearData, setProdPerYearData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [pageInput, setPageInput] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showInstruction, setShowInstruction] = useState(true);
  const [noDataFound, setNoDataFound] = useState(false);
  useEffect(() => {
    if (selectedState !== "Select State") {
      fetchData(selectedState, selectedYear, currentPage, selectedCrop);
    }
    //eslint-disable-next-line
  }, [
    selectedState,
    selectedYear,
    currentPage,
    pageSize,
    sortColumn,
    sortOrder,
    selectedCrop,
  ]);
  const fetchData = (state, year, page, crop) => {
    setLoading(true);
    axios
      .get(
        `http://localhost:3001/api/products?state=${state}&year=${year}&crop=${crop}&page=${page}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
      )
      .then((response) => {
        const { products, metadata, cropProduction, stateProduction } =
          response.data;
        if (products.length === 0) {
          setNoDataFound(true);
          setLoading(false);
          return;
        }
        setNoDataFound(false);
        setTableData(products);
        setTotalPages(metadata.totalPages);
        setProdPerCropData(cropProduction);
        setProdPerYearData(stateProduction);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setShowInstruction(false);
  };
  const handlePageInputChange = (event) => setPageInput(event.target.value);
  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      alert("Please enter a valid page number.");
    }
  };
  const handleHeaderClick = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };
  const handleReset = () => {
    setSelectedState(" ");
    setCurrentPage(1);
    setPageSize(50);
    setSortColumn(null);
    setSortOrder("asc");
    setShowInstruction(true);
  };
  const renderProdPerCropChart = () => {
    const data = Object.entries(prodPerCropData).map(([crop, production]) => ({
      label: crop,
      value: production,
    }));
    const ProdPerCropChart = (data) => {
      setSelectedCrop(data.label);
    };
    return (
      <ChartSection
        data={data}
        title="Production Per Crop"
        onClick={ProdPerCropChart}
      />
    );
  };
  const renderProdPerYearChart = () => {
    const data = Object.entries(prodPerYearData).map(([year, production]) => ({
      label: year,
      value: production,
    }));
    const ProdPerYearChart = (data) => {
      setSelectedYear(data.label);
    };
    return (
      <ChartSection
        data={data}
        title="Production Per Year"
        onClick={ProdPerYearChart}
      />
    );
  };
  return (
    <div className="container">
      <h1 className="title">State-wise Data {selectedState}</h1>
      {showInstruction && selectedState === "Select State" && (
        <p
          style={{
            color: "red",
            fontSize: "large",
            textAlign: "center",
          }}
        >
          Please select a state to proceed further.
        </p>
      )}
      <FilterSection
        states={states}
        selectedState={selectedState}
        handleStateChange={handleStateChange}
        handleReset={handleReset}
      />
      {selectedState !== "Select State" && (
        <div className="data-section">
          {loading ? (
            <LoadingOverlay />
          ) : (
            <>
              {noDataFound ? (
                <p>No data found.</p>
              ) : (
                <>
                  <div className="chart-section">
                    {renderProdPerCropChart()}
                    {renderProdPerYearChart()}
                  </div>
                  <Pagination
                    pageSize={pageSize}
                    totalPages={totalPages}
                    pageInput={pageInput}
                    handlePageInputChange={handlePageInputChange}
                    handlePageInputSubmit={handlePageInputSubmit}
                    setPageSize={setPageSize}
                  />
                  <TableSection
                    tableData={tableData}
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    handleHeaderClick={handleHeaderClick}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
export default Main;
