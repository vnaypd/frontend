import React, { useState, useEffect } from "react";
import axios from "axios";
import FilterSection from "./FilterSection";
import ChartSection from "./ChartSection";
import TableSection from "./TableSection";
import Pagination from "./Pagination";
import LoadingOverlay from "./LoadingOverlay";
import "./Main.css";

function Main() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [prodPerCropData, setProdPerCropData] = useState([]);
  const [prodPerYearData, setProdPerYearData] = useState([]);
  const [pageInput, setPageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [years, setYears] = useState(["All"]);
  const [crops, setCrops] = useState(["All"]);
  const [showInstruction, setShowInstruction] = useState(true);

  useEffect(() => {
    fetchData(selectedState, selectedYear, currentPage, selectedCrop);
    //eslint-disable-next-line
  }, [selectedState, selectedYear, currentPage, pageSize, sortColumn, sortOrder, selectedCrop]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/products")
      .then((response) => {
        const { allStates, allYears, stateCrops } = response.data;
        setStates(["All", ...allStates]);
        setYears(["All", ...allYears]);
        setCrops(["All", ...stateCrops]);
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
  }, []);

  const fetchData = (state, year, page, crop) => {
    setLoading(true);
    axios
      .get(
        `http://localhost:3001/api/products?state=${state}&year=${year}&crop=${crop}&page=${page}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
      )
      .then((response) => {
        const { products, metadata, cropProduction, stateProduction } = response.data;
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
    setShowInstruction(false); // Hide the instruction once the state is selected
  };
  const handleYearChange = (event) => setSelectedYear(event.target.value);
  const handleCropChange = (event) => setSelectedCrop(event.target.value);
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
    setSelectedState("All");
    setSelectedYear("All");
    setSelectedCrop("All");
    setCurrentPage(1);
    setPageSize(50);
    setSortColumn(null);
    setSortOrder("asc");
    setShowInstruction(true); // Show the instruction again after reset
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
      <h1>State-wise Data</h1>
      {showInstruction && selectedState === "All" && (
        <p style={{ color: 'red', fontSize:'large', textAlign:'left', margin:"16px"} }>Please select a state to proceed further.</p>
      )}
      <FilterSection
        states={states}
        selectedState={selectedState}
        handleStateChange={handleStateChange}
        years={years}
        selectedYear={selectedYear}
        handleYearChange={handleYearChange}
        crops={crops}
        selectedCrop={selectedCrop}
        handleCropChange={handleCropChange}
        handleReset={handleReset}
      />
      <div className="data-section">
        {loading ? (
          <LoadingOverlay />
        ) : selectedState !== "All" ? (
          <>
            <h2>Data for {selectedState}</h2>
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
        ) : null}
      </div>
    </div>
  );
}

export default Main;
