from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
model = joblib.load("best_campaign_fraud_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get input data from request
        data = request.get_json()
        
        # Convert input data to DataFrame
        df = pd.DataFrame([data])
        
        # Make prediction
        prediction = model.predict(df)
        prediction_label = "Fraudulent" if prediction[0] == 1 else "Legitimate"
        
        return jsonify({"prediction": prediction_label})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
