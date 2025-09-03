import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [reasons, setReasons] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await fetch("http://localhost:4898/admin/claims");
        if (!res.ok) throw new Error("Failed to fetch claims");
        const data = await res.json();
        setClaims(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClaims();
  }, []);

  const handleReasonChange = (id, value) => {
    setReasons((prev) => ({ ...prev, [id]: value }));
  };

  const handleAction = async (id, action) => {
    setLoading(true);
    try {
      const reason = reasons[id] || `${action} by admin`;
      const res = await fetch(`http://localhost:4898/admin/claims/${id}/${action}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Action failed");
      const data = await res.json();
      alert(`${action.toUpperCase()} successful!`);
      setClaims((prev) =>
        prev.map((c) =>
          c._id === id
            ? { ...c, review: { ...c.review, status: action, reason } }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("Action failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-claim-container">
      <h2 className="admin-claim-header">Admin Checks Dashboard</h2>
      {claims.map((claim) => (
        <div key={claim._id} className="admin-claim-card">
          <div className="admin-claim-left">
            <p className="admin-claim-email">{claim.email}</p>

            <div className="admin-claim-check-item">
              <strong>Visit Reason:</strong>
              <span className={claim.checks.visit_reason_consistency.passed ? "admin-claim-passed" : "admin-claim-failed"}>
                {claim.checks.visit_reason_consistency.passed ? "Passed" : "Failed"}
              </span>
              {claim.checks.visit_reason_consistency.flag && (
                <p className="admin-claim-flag-text">{claim.checks.visit_reason_consistency.flag}</p>
              )}
            </div>

            <div className="admin-claim-check-item">
              <strong>Treatment:</strong>
              <span className={claim.checks.treatment_fulfillment.passed ? "admin-claim-passed" : "admin-claim-failed"}>
                {claim.checks.treatment_fulfillment.passed ? "Passed" : "Failed"}
              </span>
              {claim.checks.treatment_fulfillment.extra.length > 0 && (
                <p className="admin-claim-flag-text">Extra: {claim.checks.treatment_fulfillment.extra.join(", ")}</p>
              )}
              {claim.checks.treatment_fulfillment.missing.length > 0 && (
                <p className="admin-claim-flag-text">Missing: {claim.checks.treatment_fulfillment.missing.join(", ")}</p>
              )}
            </div>

            <div className="admin-claim-check-item">
              <strong>Policy:</strong>
              <span className={claim.checks.policy_exclusions.passed ? "admin-claim-passed" : "admin-claim-failed"}>
                {claim.checks.policy_exclusions.passed ? "Passed" : "Failed"}
              </span>
              {claim.checks.policy_exclusions.excluded_items.length > 0 && (
                <p className="admin-claim-flag-text">Excluded: {claim.checks.policy_exclusions.excluded_items.join(", ")}</p>
              )}
            </div>

            <div className="admin-claim-check-item">
              <strong>Amount:</strong>
              <span className={claim.checks.eligible_amount_calculation.passed ? "admin-claim-passed" : "admin-claim-failed"}>
                {claim.checks.eligible_amount_calculation.passed ? "Passed" : "Failed"}
              </span>
              <p>Total: {claim.checks.eligible_amount_calculation.totalClaimed}</p>
              <p>Eligible: {claim.checks.eligible_amount_calculation.eligibleAmount}</p>
            </div>
          </div>

          <div className="admin-claim-right">
            <textarea
              className="admin-claim-reason-textarea"
              placeholder="Enter reason..."
              value={reasons[claim._id] || ""}
              onChange={(e) => handleReasonChange(claim._id, e.target.value)}
            />
            <div className="admin-claim-buttons">
              <button className="admin-claim-approve-btn" onClick={() => handleAction(claim._id, "approve")} disabled={loading}>
                Approve
              </button>
              <button className="admin-claim-reject-btn" onClick={() => handleAction(claim._id, "reject")} disabled={loading}>
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;