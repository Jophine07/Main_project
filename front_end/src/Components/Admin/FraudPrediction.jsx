import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; 
import AdminDashboard from "./AdminDashboard";

export default function CampaignFraudDetector() {
  const [formData, setFormData] = useState({
    emailDomain: "",
    category: "IOT",
    fundingType: "All or Nothing",
    status: "Pending",
    targetAmount: "",
    collectedAmount: "",
    deadlineDays: "",
    description: "",  // ✅ Added description
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Checking stored cookies...");
    const savedData = {
      emailDomain: Cookies.get("fraud_email") || "",
      category: Cookies.get("fraud_category") || "IOT",
      fundingType: Cookies.get("fraud_fundingType") || "All or Nothing",
      status: Cookies.get("fraud_status") || "Pending",
      targetAmount: Cookies.get("fraud_targetAmount") || "",
      collectedAmount: Cookies.get("fraud_collectedAmount") || "",
      deadlineDays: Cookies.get("fraud_deadline") || "",
      description: Cookies.get("fraud_description") || "No description available",  // ✅ Retrieving description
    };
    console.log("Loaded from cookies:", savedData);
    setFormData(savedData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    Cookies.set(`fraud_${name}`, value, { expires: 7 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    const formattedData = {
      "Email Domain": formData.emailDomain.trim(),
      "Category": formData.category,
      "Funding Type": formData.fundingType,
      "Status": formData.status,
      "Target Amount": parseFloat(formData.targetAmount) || 0,
      "Collected Amount": parseFloat(formData.collectedAmount) || 0,
      "Deadline (Days)": parseInt(formData.deadlineDays) || 0,
      "Description": formData.description.trim(),  // ✅ Sending description
    };

    console.log("Sending Data to API:", formattedData);

    try {
      const response = await axios.post("http://localhost:5000/predict", formattedData);
      console.log("Prediction Response:", response.data);
      setPrediction(response.data.prediction);
    } catch (err) {
      setError("Error predicting fraud. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminDashboard />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Campaign Fraud Detector</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input type="text" name="emailDomain" placeholder="Email Domain" value={formData.emailDomain} onChange={handleChange} required style={styles.input} />
            <select name="category" value={formData.category} onChange={handleChange} style={styles.input}>
              <option value="IOT">IOT</option>
              <option value="AWS Hosting">AWS Hosting</option>
            </select>
            <select name="fundingType" value={formData.fundingType} onChange={handleChange} style={styles.input}>
              <option value="All or Nothing">All or Nothing</option>
              <option value="Flexible">Flexible</option>
            </select>
            <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
            <input type="number" name="targetAmount" placeholder="Target Amount" value={formData.targetAmount} onChange={handleChange} required style={styles.input} />
            <input type="number" name="collectedAmount" placeholder="Collected Amount" value={formData.collectedAmount} onChange={handleChange} required style={styles.input} />
            <input type="number" name="deadlineDays" placeholder="Deadline (Days)" value={formData.deadlineDays} onChange={handleChange} required style={styles.input} />
            <textarea name="description" placeholder="Campaign Description" value={formData.description} onChange={handleChange} style={styles.textarea} />  {/* ✅ Description input field */}
            <button type="submit" style={styles.button}>{loading ? "Predicting..." : "Check Fraud Status"}</button>
          </form>

          {prediction && <div style={{ ...styles.result, backgroundColor: prediction === "Fraudulent" ? "#ff4d4d" : "#4CAF50" }}>Prediction: {prediction}</div>}
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ✅ No second export default

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "20px",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  textarea: {  // ✅ Added style for textarea
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    height: "80px",
    resize: "vertical",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  result: {
    marginTop: "15px",
    padding: "10px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "6px",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};    
