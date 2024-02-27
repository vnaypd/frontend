import React from "react";
import "./App.css"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Filter  from "./Components/Filter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Filter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
