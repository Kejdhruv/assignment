import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4898/API/USER", {
      method: "GET",
      credentials: "include", // send cookies
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user || user.role !== "Admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute; 