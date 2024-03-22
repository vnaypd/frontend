import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto"; // Import Chart.js

const ChartSection = ({ data, title, onClick }) => {
  const chartRef = useRef(null); // Reference to the canvas element

  useEffect(() => {
    // Function to create the chart
    const createChart = () => {
      const ctx = chartRef.current.getContext("2d"); // Get the context of the canvas element
      new Chart(ctx, {
        type: "bar", // Specify the type of chart (bar chart)
        data: {
          labels: data.map((item) => item.label),
          datasets: [
            {
              label: title,
              backgroundColor: "rgba(75,192,192,1)",
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 2,
              data: data.map((item) => item.value),
            },
          ],
        },
        options: {
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              onClick(data[index]);
            }
          },
          scales: {
            x: {
              type: "category",
              labels: data.map((item) => item.label),
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    };

    createChart(); // Call the function to create the chart
  }, [data, title, onClick]);

  return (
    <div className="chart">
      <h2>{title}</h2>
      <canvas ref={chartRef}></canvas> {/* Canvas element for the chart */}
    </div>
  );
};

export default ChartSection;
