from ultralytics import YOLO
from collections import Counter
import cv2

class ObjectDetector:
    def __init__(self, model_path):
        self.model = YOLO(model_path)

    def process_image(self, image_path):
        results = self.model(image_path)
        return self._process_results(results[0])

    def process_video(self, video_path):
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return None

        frame_rate = int(cap.get(cv2.CAP_PROP_FPS))
        frame_count = 0
        all_detections = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            if frame_count % frame_rate == 0:  # Process 1 frame per second
                results = self.model(frame)
                result = results[0]
                detections = self._get_valid_detections(result.boxes)
                all_detections.extend(detections)

            frame_count += 1

        cap.release()
        return self._count_detections(all_detections)

    def _process_results(self, result):
        boxes = result.boxes
        if boxes is None:
            return {"class_counts": {}}

        valid_detections = self._get_valid_detections(boxes)
        return self._count_detections(valid_detections)

    def _get_valid_detections(self, boxes):
        if boxes is None:
            return []

        class_indices = boxes.cls.cpu().numpy()
        confidences = boxes.conf.cpu().numpy()

        return [
            (int(cls), float(conf))
            for cls, conf in zip(class_indices, confidences)
            if conf >= 0.5
        ]

    def _count_detections(self, detections):
        if not detections:
            return {"class_counts": {}}

        class_names = self.model.names
        filtered_counts = Counter([cls for cls, _ in detections])

        return {
            "class_counts": {
                class_names[cls]: count 
                for cls, count in filtered_counts.items()
            }
        }