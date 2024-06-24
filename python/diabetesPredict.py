import joblib
import sys
import json
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd

import tensorflow as tf


model = tf.keras.models.load_model('predictionModels\diab.h5')


# Read input data from stdin
data = json.loads(sys.stdin.read())


# Read input data from stdin
# gender='Female'
# age=80.0 
# hypertension=False
# heart_disease=1
# smoking_history='never'
# bmi=25.19
# HbA1c_level=6.6
# blood_glucose_level=140
gender=data['gender']
age=data['age']
hypertension=data['hypertension']
heart_disease=data['heart_disease']
smoking_history=data['smoking_history']
bmi=data['bmi']
HbA1c_level=data['HbA1c_level']
blood_glucose_level=data['blood_glucose_level']
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



features = [age, hypertension,  heart_disease,  bmi,  HbA1c_level, blood_glucose_level,  gender_Female,  gender_Male,
            gender_Other, smoking_history_No_Info , smoking_history_current, smoking_history_ever,  smoking_history_former, 
            smoking_history_never, smoking_history_not_current ]
scaler =joblib.load('predictionModels\scaler.joblib')


features = scaler.transform([features])
# Predict
prediction = model.predict([features])

# Output prediction

prediction_list = prediction.tolist()


# Print the prediction result
print(json.dumps({'prediction': prediction_list[0]}))
