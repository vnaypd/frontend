import axios from "axios";
import React, { useState, useEffect } from "react";
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
import "./FilterData.css";
import imag from "../Assets/images/69.gif";

const FilterData = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [stateProduction, setStateProduction] = useState({});
  const [cropProduction, setCropProduction] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [stateLoading, setStateLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  // eslint-disable-next-line
  const [totalPages, setTotalPages] = useState(0); // Added state for total pages

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "http://localhost:3001/api/products";
        if (selectedState !== "All") {
          url += `?state=${selectedState}`;
        }
        const response = await axios.get(url);
        console.log("current data",response)
        const sortedData = response.data.products.sort((a, b) => {
          return a.State.localeCompare(b.State) || a.Year.localeCompare(b.Year);
        });
        setProducts(sortedData);
        setLoading(false);
        setCurrentPage(response.data.metadata.currentPage);
        setTotalPages(response.data.metadata.totalPages); // Set total pages
      } catch (error) {
        setError("Error fetching data: " + error.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedState, selectedYear]); // Update useEffect dependencies

  useEffect(() => {
    if (selectedState !== "All") {
      setStateLoading(true);
      const fetchStateData = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/products?state=${selectedState}&page=${currentPage}`);
          const stateProductionData = response.data.products.reduce((acc, product) => {
            const year = product.Year;
            const production = parseFloat(product.Production);
            acc[year] = (acc[year] || 0) + production;
            return acc;
          }, {});
          setStateProduction(stateProductionData);
          setStateLoading(false);
        } catch (error) {
          console.error("Error fetching state production data:", error);
          setStateLoading(false);
        }
      };
      fetchStateData();
    } else {
      setStateProduction({});
      setStateLoading(false);
    }
  }, [selectedState, selectedYear, currentPage]); // Update useEffect dependencies

  useEffect(() => {
    if (selectedState !== "All") {
      setStateLoading(true);
      const filteredProducts = products.filter((product) => {
        if (selectedYear !== "All" && product.Year !== selectedYear) {
          return false;
        }
        return product.State === selectedState;
      });

      const productionPerYear = {};
      const productionPerCrop = {};

      filteredProducts.forEach((product) => {
        const year = product.Year;
        const production = parseFloat(product.Production);
        const crop = product.Crop;

        // Production per year
        if (productionPerYear[year]) {
          productionPerYear[year] += production;
        } else {
          productionPerYear[year] = production;
        }

        // Production per crop
        if (productionPerCrop[crop]) {
          productionPerCrop[crop] += production;
        } else {
          productionPerCrop[crop] = production;
        }
      });

      setStateProduction(productionPerYear);
      setCropProduction(productionPerCrop);
      setTimeout(() => {
        setStateLoading(false);
      }, 100);

      const districts = filteredProducts.map((product) => product.District);
      setFilteredDistricts([...new Set(districts)]);
    } else {
      setStateProduction({});
      setCropProduction({});
      setFilteredDistricts([]);
    }
  }, [selectedState, selectedYear, products]);

  useEffect(() => {
    if (selectedState !== "All") {
      setStateLoading(true); // Set loading state when selecting district
      const filteredProducts = products.filter((product) => {
        if (selectedYear !== "All" && product.Year !== selectedYear) {
          return false;
        }
        return (
          product.State === selectedState &&
          (selectedDistrict === "All" || product.District === selectedDistrict)
        );
      });

      const productionPerCrop = {};

      filteredProducts.forEach((product) => {
        const crop = product.Crop;
        const production = parseFloat(product.Production);

        // Production per crop
        if (productionPerCrop[crop]) {
          productionPerCrop[crop] += production;
        } else {
          productionPerCrop[crop] = production;
        }
      });

      setCropProduction(productionPerCrop);
      setTimeout(() => {
        setStateLoading(false); // Set loading state after data is processed
      }, 100); // 1 second delay for blurring effect
    } else {
      setCropProduction({});
    }
  }, [selectedState, selectedDistrict, selectedYear, products]);

  const filteredStates = [
    "All",
    ...new Set(products.map((product) => product.State)),
  ];

  const filteredYears = [
    "All",
    ...new Set(products.map((product) => product.Year)),
  ];

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
    setSelectedDistrict("All"); // Reset selected district when changing state
    setFiltersApplied(true);
  };

  const handleYearChange = (event) => {
    const selectedYear = event.target.value;
    setSelectedYear(selectedYear);
    setFiltersApplied(true);
  };

  const handleDistrictChange = (event) => {
    const selectedDistrict = event.target.value;
    setSelectedDistrict(selectedDistrict);
    setFiltersApplied(true);

    // If "All" is selected, set filteredDistricts to an empty array to show data for all districts
    if (selectedDistrict === "All") {
      setFilteredDistricts([]);
    } else {
      // Otherwise, update filteredDistricts to only contain the selected district
      setFilteredDistricts([selectedDistrict]);
    }
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setFiltersApplied(true);
  };

  const filterProducts = (product) => {
    if (selectedState !== "All" && product.State !== selectedState) {
      return false;
    }
    if (selectedYear !== "All" && product.Year !== selectedYear) {
      return false;
    }
    if (selectedDistrict !== "All" && product.District !== selectedDistrict) {
      return false;
    }
    if (
      searchText &&
      !(
        product.State.toLowerCase().includes(searchText.toLowerCase()) ||
        product.Crop.toLowerCase().includes(searchText.toLowerCase())
      )
    ) {
      return false;
    }
    return true;
  };

  const filteredProducts = products.filter(filterProducts);

  const prepareChartData = (data) => {
    return Object.keys(data).map((key) => ({
      name: key,
      production: data[key],
    }));
  };

  const yearProductionData = prepareChartData(stateProduction);
  const cropProductionData = prepareChartData(cropProduction);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPaginationLoading(true);
    setTimeout(() => {
      setPaginationLoading(false);
    }, 500);
    console.log(`Fetching data for state: ${selectedState}, page: ${pageNumber}`);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    const maxButtonsToShow = 5;
    const maxLeft = Math.max(0, currentPage - Math.floor(maxButtonsToShow / 2));
    const maxRight = Math.min(totalPages - 1, maxLeft + maxButtonsToShow - 1);

    return (
      <div className="pagination">
        <button onClick={() => handlePageChange(1)}>First</button>
        <button onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </button>

        {pageNumbers.slice(maxLeft, maxRight + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={currentPage === pageNumber ? "active" : ""}
          >
            {pageNumber}
          </button>
        ))}

        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        <button onClick={() => handlePageChange(totalPages)}>Last</button>

        {paginationLoading && <div className="loading">Loading...</div>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading">
          <img src={imag} alt="" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className={paginationLoading ? "blur" : ""}>
      <div className="container">
        <h1 className="title">Products</h1>
        <div className="filters">
          <div className="filter">
            <label htmlFor="stateSelect">Select State: </label>
            <select
              id="stateSelect"
              value={selectedState}
              onChange={handleStateChange}
            >
              {filteredStates.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {stateLoading && <div className="loading">Loading...</div>}{" "}
            {/* Loading indicator when selecting state */}
          </div>
          <div className="filter">
            <label htmlFor="yearSelect">Select Year: </label>
            <select
              id="yearSelect"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {filteredYears.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="filter">
            <label htmlFor="districtSelect">Select District: </label>
            <select
              id="districtSelect"
              value={selectedDistrict}
              onChange={handleDistrictChange}
            >
              <option value="All">All</option> {/* Add this option */}
              {filteredDistricts.sort().map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div className="filter">
            <label htmlFor="searchInput">Search: </label>
            <input
              type="text"
              id="searchInput"
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="data-section">
          {selectedState !== "All" &&
            Object.keys(stateProduction).length > 0 && (
              <div className="production-per-year">
                <h2>Year-wise Production for {selectedState} State</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={yearProductionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      height={100}
                      dy={10} // You might need to adjust this value based on your design
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="production" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          {selectedState !== "All" &&
            Object.keys(cropProduction).length > 0 && (
              <div className="production-per-crop">
                <h2>Production per Crop for {selectedState} State</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cropProductionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      height={100}
                      dy={10} // You might need to adjust this value based on your design
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="production" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
        </div>
        {filtersApplied && filteredProducts.length > 0 ? (
          <div className="table-container">
            <h2>Filtered Products for {selectedState} State</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Crop</th>
                  <th>Season</th>
                  <th>Year</th>
                  <th>Yield</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((product, index) => (
                    <tr key={index}>
                      <td>{product.Id}</td>
                      <td>{product.State}</td>
                      <td>{product.District}</td>
                      <td>{product.Crop}</td>
                      <td>{product.Season}</td>
                      <td>{product.Year}</td>
                      <td>{product.Yield}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {renderPagination()}
          </div>
        ) : (
          filtersApplied && <div className="no-results">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default FilterData;
