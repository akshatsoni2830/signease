import cv2
import numpy as np
import os
import json
from datetime import datetime
import mediapipe as mp

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)

def extract_landmarks(image):
    """Extract hand landmarks from image"""
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(image_rgb)
    
    if results.multi_hand_landmarks:
        landmarks = results.multi_hand_landmarks[0]
        # Extract 21 landmarks with x, y, z coordinates
        landmarks_array = []
        for landmark in landmarks.landmark:
            landmarks_array.extend([landmark.x, landmark.y, landmark.z])
        return np.array(landmarks_array)
    return None

def normalize_landmarks(landmarks):
    """Normalize landmarks to be scale and position invariant"""
    # Center the landmarks
    landmarks = landmarks.reshape(-1, 3)
    center = np.mean(landmarks, axis=0)
    landmarks = landmarks - center
    
    # Scale to unit size
    scale = np.max(np.linalg.norm(landmarks, axis=1))
    landmarks = landmarks / scale
    
    return landmarks.flatten()

def collect_data(label, num_samples=100, output_dir="collected_data"):
    """Collect training data for a specific sign"""
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open camera")
        return
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(os.path.join(output_dir, label), exist_ok=True)
    
    print(f"Collecting {num_samples} samples for sign: {label}")
    print("Press 'c' to capture, 'q' to quit")
    
    collected = 0
    while collected < num_samples:
        ret, frame = cap.read()
        if not ret:
            continue
            
        # Flip frame horizontally for mirror effect
        frame = cv2.flip(frame, 1)
        
        # Extract landmarks
        landmarks = extract_landmarks(frame)
        
        # Draw hand landmarks
        if landmarks is not None:
            landmarks_reshaped = landmarks.reshape(-1, 3)
            for i, (x, y, z) in enumerate(landmarks_reshaped):
                x_pixel = int(x * frame.shape[1])
                y_pixel = int(y * frame.shape[0])
                cv2.circle(frame, (x_pixel, y_pixel), 3, (0, 255, 0), -1)
            
            # Show that hand is detected
            cv2.putText(frame, f"Hand detected - {collected}/{num_samples}", 
                       (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        else:
            cv2.putText(frame, "No hand detected", 
                       (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        cv2.imshow('Data Collection', frame)
        
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('c') and landmarks is not None:
            # Save normalized landmarks
            normalized = normalize_landmarks(landmarks)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
            filename = f"{label}_{timestamp}.json"
            filepath = os.path.join(output_dir, label, filename)
            
            data = {
                "label": label,
                "landmarks": normalized.tolist(),
                "timestamp": timestamp,
                "original_landmarks": landmarks.tolist()
            }
            
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
            
            collected += 1
            print(f"Captured sample {collected}/{num_samples}")
    
    cap.release()
    cv2.destroyAllWindows()
    print(f"Data collection complete! {collected} samples saved for '{label}'")

def main():
    """Main function to collect data for multiple signs"""
    signs = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "SPACE", "DELETE", "NOTHING"
    ]
    
    print("SignEase Data Collection Tool")
    print("Available signs:", ", ".join(signs))
    
    while True:
        sign = input("\nEnter sign to collect (or 'quit' to exit): ").upper()
        if sign == 'QUIT':
            break
        elif sign not in signs:
            print(f"Invalid sign. Available signs: {', '.join(signs)}")
            continue
        
        try:
            num_samples = int(input("Number of samples to collect (default 100): ") or "100")
        except ValueError:
            num_samples = 100
        
        collect_data(sign, num_samples)

if __name__ == "__main__":
    main()
