import React, { useState } from "react";
import "./Home.css"; // external css file

function Home() {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // generate preview URLs
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setMessage("Please upload at least one file.");
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("documents", file);
      });

      const res = await fetch("http://localhost:4898/api/claims", {
        method: "POST",
        credentials: "include", // ✅ send cookies (token)
        body: formData, // fetch automatically sets headers for FormData
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Upload successful!");
      } else {
        setMessage(data.error || "Upload failed!");
      }
    } catch (err) {
      console.error("Error uploading files:", err);
      setMessage("Upload failed!");
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
            <img key={idx} src={url} alt={`preview-${idx}`} className="preview-img" />
          ))}
        </div>
      )}
    </label>

    <button className="upload-btn" onClick={handleSubmit}>Upload</button>
    {message && <p className="message">{message}</p>}
  </div>
</div>
  );
}

export default Home;