import React, { useEffect, useState } from "react";
import "./ClaimStatus.css"
function Pending() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPendingClaims() {
      try {
        const res = await fetch("http://localhost:4898/claims/user/pending", {
          method: "GET",
          credentials: "include", // ✅ send cookie with token
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch claims");

        setClaims(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPendingClaims();
  }, []);

  if (loading) return <p>Loading claims...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (claims.length === 0) return <p>No pending claims found.</p>;

  return (
     <div className="claims-container">
  <h2>Pending Claims</h2>
  {claims.map((claim) => (
    <div key={claim._id} className="claim-card">

      {/* Status Badge */}
      <div className="status-badge status-pending">Pending</div>

      {/* Prescription + Bills */}
      <div className="claim-top">
        {/* Prescription */}
        <div className="inner-card prescription-card">
          <h3>Prescription</h3>
          <p><strong>No:</strong> {claim.prescription.prescription_number}</p>
                  <p><strong>Date:</strong> {claim.prescription.prescription_date}</p>
                  <p><strong>Hospital Name:</strong> {claim.prescription.facility_name}</p>
                  <p><strong>Doctor:</strong> {claim.prescription.doctor_name} ({claim.prescription.doctor_specialty})</p>
                  <p><strong>Visit Reason:</strong> {claim.prescription.visit_reason}</p>
                
        {claim.prescription.diagnosis && claim.prescription.diagnosis.length > 0 && (
  <div className="diagnosis-section">
    <h4>Diagnosis</h4>
    <ul>
      {claim.prescription.diagnosis.map((d, idx) => (
        <li key={idx}>{d}</li>
      ))}
    </ul>
  </div>
                  )} 
                  
                  
          {/* Prescription Orders */}
{claim.prescription.prescription_orders && claim.prescription.prescription_orders.length > 0 && (
  <div className="orders-section">
    <h4>Prescription Orders</h4>
    <ul>
      {claim.prescription.prescription_orders.map((order, idx) => (
        <li key={idx}>{order.item}</li>
      ))}
    </ul>
  </div>
)}
        </div>

        {/* Bills */}
   {/* Bills */}
<div className="inner-card bill-card">
  <h3>Bill</h3>
  {claim.bills.map((bill, idx) => (
    <div key={idx} className="bill-details">
      <p><strong>Bill No:</strong> {bill.bill_number}</p>
      <p><strong>Total Paid:</strong> ₹{bill.total_paid_amount}</p>

      {/* Line Items Section */}
      {bill.line_items && bill.line_items.length > 0 && (
        <div className="bill-items-section">
          <h4>Bill Items</h4>
          <ul>
            {bill.line_items.map((item, i) => (
              <li key={i}>
                {item.name} — ₹{item.final}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ))}
</div>
      </div>

      {/* Flags / Issues */}
      <div className="claim-issues">
        <h4>Issues / Flags</h4>
        {!claim.checks?.visit_reason_consistency?.passed && (
          <p className="issue-item">{claim.checks.visit_reason_consistency.flag}</p>
        )}
        {!claim.checks?.treatment_fulfillment?.passed && (
          <p className="issue-item">
            Extra items: {claim.checks.treatment_fulfillment.extra.join(", ")}
          </p>
        )}
        {!claim.checks?.policy_exclusions?.passed && claim.checks.policy_exclusions.excluded_items && (
          <p className="issue-item">
            Excluded items: {claim.checks.policy_exclusions.excluded_items.join(", ")}
          </p>
        )}
      </div>

    </div>
  ))}
</div>
  );
}

export default Pending;