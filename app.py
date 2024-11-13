from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
from flask_cors import CORS

# Load the pre-trained model from the pickle file
model_path = 'model_flood_disease.pkl'
with open(model_path, 'rb') as file:
    model = pickle.load(file)

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse the incoming JSON request data
        data = request.get_json(force=True)

        print(f"Received data: {data}")  # Log the incoming data for debugging
        
        # Extract features from the request data and convert them to integers
        features = [
            int(data['watery_stool']),
            int(data['fever']),
            int(data['abdominal_cramps']),
            int(data['fatigue']),
            int(data['rice_water_stool']),
            int(data['dehydration']),
            int(data['leg_cramps']),
            int(data['vomiting']),
            int(data['rapid_heart_rate'])
        ]

        # Convert the features into a NumPy array with the correct shape
        features_array = np.array([features])

        # Make predictions using the loaded model
        prediction = model.predict(features_array)

        # Return the prediction result as a JSON response
        return jsonify({
            'prediction': int(prediction[0])
        })
    
    except ValueError as ve:
        return jsonify({'error': 'Invalid input data', 'message': str(ve)}), 400
    
    except Exception as e:
        return jsonify({'error': 'An error occurred during prediction', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
