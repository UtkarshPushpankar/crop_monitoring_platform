from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import getAnswer, getWeatherBasedRecommendation
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads/'


@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        print("Request received")
        file = request.files['image']
        print(file)

        if not file:
            return jsonify({'error': 'No file provided'}), 400    
        
        print(file)
        file.save(UPLOAD_FOLDER + file.filename)
        return jsonify({'message': 'Image uploaded successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/chats', methods=['POST'])
def handle_chats():
    try:
        data = request.get_json()
        messages = data.get('messages', [])
        query = data.get('query', '')
        language = data.get('language', 'english')

        if not query:
            return jsonify({'error': 'No query provided'}), 400

        response = getAnswer(messages, query, language)    
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/weather', methods=['POST'])
def handle_weather():
    print("Weather request received")
    try:
        data = request.get_json()
        # print(data)
  
        recommendation = getWeatherBasedRecommendation(data.get('weather_data', ''))
        # print("Recommendation:", recommendation)
        
        return jsonify({'recommendation': recommendation}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)