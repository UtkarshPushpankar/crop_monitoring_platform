import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import getAnswer, getAnswerWithImage
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
        messages = request.form.get("messages", "[]")
        query = request.form.get("query", "")
        language = request.form.get("language", "english")
        image = request.files.get("image", None)

        if image:
            # Make sure the directory exists
            os.makedirs("chats", exist_ok=True)

            # Use image.filename instead of image object
            image_path = os.path.join("chats", image.filename)
            image.save(image_path)

            response = getAnswerWithImage(messages, query, language, image_path)

            # optional cleanup
            os.remove(image_path)

            return jsonify(response), 200

        if not query:
            return jsonify({'error': 'No query provided'}), 400

        response = getAnswer(messages, query, language)    
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)