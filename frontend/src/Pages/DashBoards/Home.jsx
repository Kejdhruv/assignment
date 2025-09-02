import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePrescription, FaFileInvoiceDollar } from "react-icons/fa";
import "./Home.css";

function Home() {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setMessage("Please upload at least one file.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("documents", file);
      });

      const res = await fetch("http://localhost:4898/api/claims", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Upload successful!");
      } else {
        setMessage(data.error || "Upload failed!");
      }

      // ✅ show toast + redirect
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Error uploading files:", err);
      setMessage("Upload failed!");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="claim-upload-container">
      <div className="upload-box">
        <label className="upload-square">
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {previewUrls.length === 0 ? (
            <div className="upload-placeholder">
              <span className="plus">+</span>
              <p>Drop your claims</p>
            </div>
          ) : (
            <div className="preview-grid">
              {previewUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`preview-${idx}`}
                  className="preview-img"
                />
              ))}
            </div>
          )}
        </label>

        <button className="upload-btn" onClick={handleSubmit} disabled={loading}>
          Upload
        </button>
      </div>

      {/* Loader Modal */}
      {loading && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Processing your claim...</h3>
            <div className="loader">
              <FaFilePrescription className="icon" />
              <FaFileInvoiceDollar className="icon" />
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className={`toast ${message.includes("failed") ? "error" : "success"}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Home;