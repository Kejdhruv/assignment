import React from "react";
import { Route, Routes } from 'react-router-dom'; 
import Auth from "./Pages/Authentication/Auth";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} /> 
      <Route path="/Home" element={<h1> Supp bitches</h1>} /> 
       
    </Routes>
  );
}

export default App;
