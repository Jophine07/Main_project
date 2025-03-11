import React, { useState } from "react";
import axios from "axios";
import UserNavBar from "./UserNavBar";


const S_pred = () => {
  const [formData, setFormData] = useState({
    targetAmount: "",
    category: "",
    fundingType: "",
    numofdays: "",
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Predefined valid options
  const categories = ["IOT", "AWS Hosting"];
  const fundingTypes = ["All or Nothing", "Flexible"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPredictionResult(null);
    setLoading(true);

    // Basic validation
    const { targetAmount, category, fundingType, numofdays } = formData;

    if (!targetAmount || targetAmount <= 0 || targetAmount > 10000) {
      setError("❌ Target amount must be between ₹1 and ₹10,000.");
      setLoading(false);
      return;
    }
    if (!categories.includes(category)) {
      setError("❌ Invalid category. Choose from the list.");
      setLoading(false);
      return;
    }
    if (!fundingTypes.includes(fundingType)) {
      setError("❌ Invalid funding type. Choose from the list.");
      setLoading(false);
      return;
    }
    if (!numofdays || numofdays <= 0) {
      setError("❌ Number of days must be greater than 0.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5001/S_pred", formData);
      if (response.data && response.data.prediction) {
        setPredictionResult(response.data.prediction);
      } else {
        setError("⚠️ No prediction received from the server!");
      }
    } catch (error) {
      setError("❌ Server Error! Please check your Flask backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UserNavBar />
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4 shadow" style={{ width: "400px" }}>
          <h2 className="text-center text-primary mb-3">Success Prediction</h2>

          {error && <div className="alert alert-danger p-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="fw-bold">Target Amount (₹):</label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                className="form-control"
                min="1"
                max="10000"
                required
              />
            </div>

            <div className="mb-2">
              <label className="fw-bold">Category:</label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-select" required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="fw-bold">Funding Type:</label>
              <select name="fundingType" value={formData.fundingType} onChange={handleChange} className="form-select" required>
                <option value="">Select Funding Type</option>
                {fundingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="fw-bold">Number of Days:</label>
              <input
                type="number"
                name="numofdays"
                value={formData.numofdays}
                onChange={handleChange}
                className="form-control"
                min="1"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Predicting..." : "Predict Success"}
            </button>
          </form>

          {predictionResult && (
            <div className="mt-3 text-center fw-bold">
              🔮 Prediction: <span className={predictionResult.includes("Success") ? "text-success" : "text-danger"}>{predictionResult}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default S_pred;
