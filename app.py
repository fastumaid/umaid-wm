from flask import Flask, request, jsonify, render_template
from config import Config
from utils import allowed_file, save_uploaded_file, cleanup_file
from detector import ObjectDetector
import os

app = Flask(__name__)
app.config.from_object(Config)

# Create uploads directory if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Initialize the object detector
detector = ObjectDetector(app.config['MODEL_PATH'])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect_objects():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file uploaded'}), 400

    file = request.files['image']
    
    print("File received:", file.filename)
    # Continue processing as before...


    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename, app.config['ALLOWED_IMAGE_EXTENSIONS']):
        return jsonify({'error': 'Invalid file type'}), 400

    try:
        filepath = save_uploaded_file(file, app.config['UPLOAD_FOLDER'])
        results = detector.process_image(filepath)
        print("agaye: ", results)
        return jsonify(results)
    finally:
        cleanup_file(filepath)

@app.route('/process_video', methods=['POST'])
def process_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file uploaded'}), 400

    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename, app.config['ALLOWED_VIDEO_EXTENSIONS']):
        return jsonify({'error': 'Invalid file type'}), 400

    try:
        filepath = save_uploaded_file(file, app.config['UPLOAD_FOLDER'])
        results = detector.process_video(filepath)
        
        if results is None:
            return jsonify({'error': 'Failed to process video file'}), 500
            
        return jsonify(results)
    finally:
        cleanup_file(filepath)

if __name__ == '__main__':
    app.run(debug=True)