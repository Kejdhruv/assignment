import React, { useEffect, useState } from "react";
import "./ClaimStatus.css"
function Rejected() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRejectedClaims() {
      try {
        const res = await fetch("http://localhost:4898/claims/user/Rejected", {
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

    fetchRejectedClaims();
  }, []);

  if (loading) return <p>Loading claims...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (claims.length === 0) return <p>No Rejected claims found.</p>;

  return (
    <div className="claims-container">
  <h2>Rejected Claims</h2>
  {claims.map((claim) => (
    <div key={claim._id} className="claim-card">

      {/* Status Badge */}
      <div className="status-badge status-rejected">Rejected</div>

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
                                           <p>
  <strong>Specialist Prescription :</strong>{" "}
  {claim.prescription.specialist_prescription ? "Yes" : "No"}
</p>
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
        <div className="inner-card bill-card">
          <h3>Bill</h3>
          {claim.bills.map((bill, idx) => (
            <div key={idx} className="bill-details">
              <p><strong>Bill No:</strong> {bill.bill_number}</p>
                  <p><strong>Total Paid:</strong> ₹{bill.total_paid_amount}</p>
                   <span><strong>Bill Date:</strong> {bill.bill_date}</span>  &nbsp; &nbsp; 
                   <span><strong>Bill Time:</strong> {bill.bill_time}</span>
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
                  {claim.checks?.eligible_amount_calculation && (
    <div className="eligible-amount">
      <p><strong>Total Claimed:</strong> ₹{claim.checks.eligible_amount_calculation.totalClaimed}</p>
      <p><strong>Eligible Amount:</strong> ₹{claim.checks.eligible_amount_calculation.eligibleAmount}</p>
      <p>
        <strong>Status:</strong>{" "}
        {claim.checks.eligible_amount_calculation.passed ? "✅ Fully Eligible" : "⚠️ Partial Eligibility"}
      </p>
    </div>
  )}         
      </div>

    </div>
  ))}
</div>
  );
}

export default Rejected;