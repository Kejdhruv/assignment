import React from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "./Pages/Authentication/Auth";
import Home from "./Pages/DashBoards/Home";
import Navbar from "./Components/Navbar";
import UserPage from "./Pages/DashBoards/UserPage";

function App() {
  return (
    <>
      <Navbar />   
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/Home" element={<Home />} />
         <Route path="/UserProfile" element={<UserPage/>} />
      </Routes>
    </>
  );
}

export default App;