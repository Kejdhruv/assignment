import React from "react";
import { Route, Routes } from 'react-router-dom'; 
import Auth from "./Pages/Authentication/Auth";
import Home from "./Pages/DashBoards/Home";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} /> 
      <Route path="/Home" element={<Home />} /> 
       
    </Routes>
  );
}

export default App;
