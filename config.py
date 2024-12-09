import os

class Config:
    UPLOAD_FOLDER = 'filing'
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max file size
    ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    ALLOWED_VIDEO_EXTENSIONS = {'mp4'}
    MODEL_PATH = "mark.pt"
