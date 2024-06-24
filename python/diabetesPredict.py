import joblib
import sys
import json
import tensorflow as tf

# Load Model
model = tf.keras.models.load_model('predictionModels\diab.h5')

# Load StandardScaler
scaler =joblib.load('predictionModels\scaler.joblib')

# Read input data from stdin
data = json.loads(sys.stdin.read())

# Set Input Values
gender=data['gender']
age=data['age']
hypertension=data['hypertension']
heart_disease=data['heart_disease']
smoking_history=data['smoking_history']
bmi=data['bmi']
HbA1c_level=data['HbA1c_level']
blood_glucose_level=data['blood_glucose_level']

# Adjust input values
if gender=='Female':
  gender_Female=True
  gender_Male=False
  gender_Other=False
else:
  gender_Female=False
  gender_Male=True
  gender_Other=False

if smoking_history=='No Info':
  smoking_history_No_Info=True
  smoking_history_current=False
  smoking_history_ever=False
  smoking_history_former=False
  smoking_history_never=False
  smoking_history_not_current=False
elif smoking_history=='current':
  smoking_history_No_Info=False
  smoking_history_current=True
  smoking_history_ever=False
  smoking_history_former=False
  smoking_history_never=False
  smoking_history_not_current=False
elif smoking_history=='ever':
  smoking_history_No_Info=False
  smoking_history_current=False
  smoking_history_ever=True
  smoking_history_former=False
  smoking_history_never=False
  smoking_history_not_current=False
elif smoking_history=='former':
  smoking_history_No_Info=False
  smoking_history_current=False
  smoking_history_ever=False
  smoking_history_former=True
  smoking_history_never=False
  smoking_history_not_current=False
elif smoking_history=='never':
  smoking_history_No_Info=False
  smoking_history_current=False
  smoking_history_ever=False
  smoking_history_former=False
  smoking_history_never=True
  smoking_history_not_current=False
else:
  smoking_history_No_Info=False
  smoking_history_current=False
  smoking_history_ever=False
  smoking_history_former=False
  smoking_history_never=False
  smoking_history_not_current=True

# Set features
features = [age, hypertension,  heart_disease,  bmi,  HbA1c_level, blood_glucose_level,  gender_Female,  gender_Male,
            gender_Other, smoking_history_No_Info , smoking_history_current, smoking_history_ever,  smoking_history_former, 
            smoking_history_never, smoking_history_not_current ]

# Scale Features
features = scaler.transform([features])

# Predict
prediction = model.predict([features])

# Output prediction
prediction_list = prediction.tolist()
print(json.dumps({'prediction': prediction_list[0]}))
