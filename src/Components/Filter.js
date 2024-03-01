import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Filter.css";

function App() {
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

  useEffect(() => {
    // Fetch initial data
    fetchData(selectedState, selectedYear, currentPage, selectedCrop);
    //eslint-disable-next-line
  }, [
    selectedState,
    selectedYear,
    currentPage,
    pageSize,
    sortColumn,
    sortOrder,
    selectedCrop, // Include selectedCrop in dependencies
  ]);

  useEffect(() => {
    // Fetch states, years, and crops
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
        const { products, metadata, cropProduction, stateProduction } =
          response.data;
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

  const handleStateChange = (event) => setSelectedState(event.target.value);
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
    setSelectedCrop("All"); // Add reset for selectedCrop
    setCurrentPage(1);
    setPageSize(50);
    setSortColumn(null);
    setSortOrder("asc");
  };

  const renderProdPerCropChart = () => {
    const data = Object.entries(prodPerCropData).map(([crop, production]) => ({
      crop,
      production,
    }));

    const ProdPerCropChart=(data)=>{
      setSelectedCrop(data.crop)
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="crop" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="production" fill="#8884d8" onClick={ProdPerCropChart} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderProdPerYearChart = () => {
    const data = Object.entries(prodPerYearData).map(([year, production]) => ({
      year,
      production,
    }));

    const ProdPerYearChart=(data)=>{
      setSelectedYear(data.year)
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="production" fill="#82ca9d" onClick={ProdPerYearChart} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="container">
      <h1>State-wise Data</h1>
      <div className="filter-section">
        <label htmlFor="stateSelect">Select a State:</label>
        <select
          id="stateSelect"
          value={selectedState}
          onChange={handleStateChange}
        >
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <label htmlFor="yearSelect">Select a Year:</label>
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label htmlFor="cropSelect">Select a Crop:</label>
        <select
          id="cropSelect"
          value={selectedCrop}
          onChange={handleCropChange}
        >
          {crops.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>

        <button onClick={handleReset}>Reset</button>
      </div>
      <div className="data-section">
        {loading ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <h2>Data for {selectedState}</h2>
            <div className="chart-section">
              <div className="chart">
                <h2>Production Per Crop</h2>
                {renderProdPerCropChart()}
              </div>
              <div className="chart">
                <h2>Production Per Year</h2>
                {renderProdPerYearChart()}
              </div>
            </div>
            <div className="table-section">
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
            <table className="table-responsive">
              <thead>
                <tr>
                  <th onClick={() => handleHeaderClick("State")}>State</th>
                  <th onClick={() => handleHeaderClick("District")}>
                    District
                  </th>
                  <th onClick={() => handleHeaderClick("Crop")}>Crop</th>
                  <th onClick={() => handleHeaderClick("Year")}>Year</th>
                  <th onClick={() => handleHeaderClick("Season")}>Season</th>
                  <th onClick={() => handleHeaderClick("Area")}>Area</th>
                  <th onClick={() => handleHeaderClick("Production")}>
                    Production
                  </th>
                  <th onClick={() => handleHeaderClick("Yield")}>Yield</th>
                </tr>
                <tr>
                  <th>
                    {sortColumn === "State" && `Sorted by State (${sortOrder})`}
                  </th>
                  <th>
                    {sortColumn === "District" &&
                      `Sorted by District (${sortOrder})`}
                  </th>
                  <th>
                    {sortColumn === "Crop" && `Sorted by Crop (${sortOrder})`}
                  </th>
                  <th>
                    {sortColumn === "Year" && `Sorted by Year (${sortOrder})`}
                  </th>
                  <th>
                    {sortColumn === "Season" &&
                      `Sorted by Season (${sortOrder})`}
                  </th>
                  <th>
                    {sortColumn === "Area" && `Sorted by Area (${sortOrder})`}
                  </th>
                  <th>
                    {sortColumn === "Production" &&
                      `Sorted by Production (${sortOrder})`}
                  </th>
                  <th>
                    {sortColumn === "Yield" && `Sorted by Yield (${sortOrder})`}
                  </th>
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
          </>
        )}
      </div>
    </div>
  );
}

export default App;
