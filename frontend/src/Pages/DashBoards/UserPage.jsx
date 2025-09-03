// Pages/DashBoards/UserDashboardPage.jsx
import React, { useState } from "react";
import Pending from "../../Components/Pending";
import Approved from "../../Components/Approved";
import Rejected from "../../Components/Rejected";
import "./UserPage.css";

function UserPage() {
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="dashboard-container">
      <h1>User Dashboard</h1>

      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          className={activeTab === "approved" ? "active" : ""}
          onClick={() => setActiveTab("approved")}
        >
          Approved
        </button>
        <button
          className={activeTab === "rejected" ? "active" : ""}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected
        </button>
      </div>

      {/* Content Rendering */}
      <div className="tab-content">
        {activeTab === "pending" && <Pending />}
        {activeTab === "approved" && <Approved />}
        {activeTab === "rejected" && <Rejected />}
      </div>
    </div>
  );
}

export default UserPage;