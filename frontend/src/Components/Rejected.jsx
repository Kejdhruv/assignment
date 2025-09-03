import React, { useEffect, useState } from "react";

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
          {/* Prescription */}
          <div className="inner-card">
            <h3>Prescription</h3>
            <p><strong>No:</strong> {claim.prescription.prescription_number}</p>
            <p><strong>Date:</strong> {claim.prescription.prescription_date}</p>
            <p><strong>Doctor:</strong> {claim.prescription.doctor_name} ({claim.prescription.doctor_specialty})</p>
            <ul>
              {claim.prescription.prescription_orders.map((order, idx) => (
                <li key={idx}>{order.item}</li>
              ))}
            </ul>
          </div>

          {/* Bills */}
          <div className="inner-card">
            <h3>Bill</h3>
            {claim.bills.map((bill, idx) => (
              <div key={idx} className="bill-details">
                <p><strong>Bill No:</strong> {bill.bill_number}</p>
                <p><strong>Total Paid:</strong> ₹{bill.total_paid_amount}</p>
                <ul>
                  {bill.line_items.map((item, i) => (
                    <li key={i}>{item.name} — ₹{item.final}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Flags / Status */}
          <div className="claim-flags">
            <h4>Status: {claim.checks?.visit_reason_consistency?.passed ? "✅ Clear" : "⚠️ Issues"}</h4>
            {!claim.checks?.visit_reason_consistency?.passed && (
              <p>{claim.checks.visit_reason_consistency.flag}</p>
            )}
            {!claim.checks?.treatment_fulfillment?.passed && (
              <p>Extra items: {claim.checks.treatment_fulfillment.extra.join(", ")}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Rejected;