from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for React frontend
CORS(app, resources={r"/S_pred": {"origins": "http://localhost:3000"}})

# Load the trained model and preprocessing tools
try:
    model = joblib.load("crowdfunding_model.pkl")
    label_encoders = joblib.load("label_encoders.pkl")
    scaler = joblib.load("scaler.pkl")
except Exception as e:
    print("❌ Error loading model or encoders:", e)
    model, label_encoders, scaler = None, None, None


@app.route("/S_pred", methods=["POST"])
def predict():
    if not model or not label_encoders or not scaler:
        return jsonify({"error": "Model files not found or could not be loaded."}), 500

    try:
        data = request.json  

        # Extract input values
        targetAmount = int(data.get("targetAmount", 0))
        category = data.get("category", "").strip()
        fundingType = data.get("fundingType", "").strip()
        numofdays = int(data.get("numofdays", 0))

        # Validate numerical inputs
        if targetAmount <= 0 or targetAmount > 10000:
            return jsonify({"error": "Target amount must be between 1 and 10,000."}), 400
        if numofdays <= 0:
            return jsonify({"error": "Number of days must be greater than zero."}), 400

        # Validate category and funding type
        valid_categories = list(label_encoders["category"].classes_)
        if category not in valid_categories:
            return jsonify({"error": f"Invalid category. Must be one of {valid_categories}."}), 400

        valid_funding_types = list(label_encoders["fundingType"].classes_)
        if fundingType not in valid_funding_types:
            return jsonify({"error": f"Invalid funding type. Must be one of {valid_funding_types}."}), 400

        # Encode categorical values
        category_encoded = label_encoders["category"].transform([category])[0]
        fundingType_encoded = label_encoders["fundingType"].transform([fundingType])[0]

        # Prepare input DataFrame
        input_data = pd.DataFrame([[targetAmount, category_encoded, fundingType_encoded, numofdays]],
                                  columns=["targetAmount", "category", "fundingType", "numofdays"])

        # Scale input
        input_data_scaled = scaler.transform(input_data)

        # Make prediction
        prediction = model.predict(input_data_scaled)[0]

        return jsonify({"prediction": "Success ✅" if prediction == 1 else "Failure ❌"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":  
    app.run(debug=True, port=5001)
