from flask import Flask, request, jsonify
from keras.models import load_model
from sklearn.preprocessing import StandardScaler
import numpy as np
import json
import joblib
import os
from flask import Flask
from dotenv import load_dotenv

app = Flask(__name__)

# Load the model
model = load_model("diab.h5")
scaler = joblib.load("scaler.joblib")

# Define a route to handle the prediction request
@app.route('/predict', methods=['POST'])
def predict():
    data = json.loads(request.data)
    
    # Extract input values
    gender = data['gender']
    age = data['age']
    hypertension = data['hypertension']
    heart_disease = data['heart_disease']
    smoking_history = data['smoking_history']
    bmi = data['bmi']
    HbA1c_level = data['HbA1c_level']
    blood_glucose_level = data['blood_glucose_level']

    # Adjust input values for gender
    gender_Female = gender == 'Female'
    gender_Male = gender == 'Male'
    gender_Other = not (gender_Female or gender_Male)

    # Adjust input values for smoking history
    smoking_options = ['no_info', 'current', 'ever', 'former', 'never', 'not_current']
    smoking_history_flags = {f'smoking_history_{option}': (smoking_history == option) for option in smoking_options}

    # Set features
    features = [
        age, hypertension, heart_disease, bmi, HbA1c_level, blood_glucose_level,
        gender_Female, gender_Male, gender_Other,
        smoking_history_flags['smoking_history_no_info'],
        smoking_history_flags['smoking_history_current'],
        smoking_history_flags['smoking_history_ever'],
        smoking_history_flags['smoking_history_former'],
        smoking_history_flags['smoking_history_never'],
        smoking_history_flags['smoking_history_not_current']
    ]

    # Scale features
    features = scaler.transform([features])

    # Predict
    prediction = model.predict(features)
    prediction_list = prediction.tolist()

    # Return the prediction
    return jsonify({'prediction': prediction_list})

if __name__ == '__main__':
    # Run the app
    app.run(host='0.0.0.0', port=5000, debug=False)