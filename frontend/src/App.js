import React from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "./Pages/Authentication/Auth";
import Home from "./Pages/DashBoards/Home";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <>
      <Navbar />   
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;