# SignEase 🤟

**Breaking Barriers with AI-powered Sign Language Communication**

SignEase is a revolutionary AI-powered platform designed to bridge the communication gap between hearing and hearing-impaired communities through real-time sign language translation and learning.

## 🌟 Features

- **Real-time Sign Language Translation**: Convert ASL gestures to text using advanced AI
- **Interactive Learning Mode**: Learn sign language with guided lessons and 3D hand coaching
- **Custom Sign Creation**: Create and train custom signs for personalized communication
- **User Authentication**: Secure login with Firebase and Supabase integration
- **Translation History**: Track your learning progress and translation history
- **Emergency Kit**: Quick access to essential signs for emergency situations
- **3D Hand Visualization**: Interactive 3D hand model for better learning
- **Video Call Integration**: Real-time communication support

## 🚀 Tech Stack

### Frontend
- **React 19** with Vite
- **Three.js** for 3D hand visualization
- **React Three Fiber** for 3D components
- **Firebase** for authentication
- **Supabase** for database
- **React Webcam** for camera integration

### Backend
- **FastAPI** with Python
- **TensorFlow** for AI model inference
- **MediaPipe** for hand landmark detection
- **OpenCV** for image processing
- **Uvicorn** as ASGI server

### AI/ML
- **Custom CNN Model** trained on ASL alphabet dataset
- **Hand Landmark Detection** using MediaPipe
- **Real-time Prediction** with confidence scoring

## 📁 Project Structure

```
signease/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── hooks/          # Custom hooks
│   └── public/             # Static assets
├── backend/                 # FastAPI backend
│   ├── app/                # Main application code
│   ├── data/               # Training data
│   ├── models/             # Trained AI models
│   └── custom_store/       # Custom sign storage
├── processed/              # Processed training data
└── start_servers.bat       # Development server startup script
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🚀 Running the Application

### Quick Start (Windows)
Use the provided batch script to start both servers:
```bash
start_servers.bat
```

### Manual Start

1. **Start Backend Server:**
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start Frontend Server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🎯 Usage

### Real-time Translation
1. Open the application in your browser
2. Allow camera permissions
3. Sign letters A-Z in front of the camera
4. View real-time predictions with confidence scores

### Learning Mode
1. Navigate to the Learning section
2. Follow guided lessons with 3D hand demonstrations
3. Practice with interactive exercises
4. Track your progress

### Custom Signs
1. Go to Custom Signs section
2. Record samples of your custom sign
3. Train the model on your data
4. Use your custom signs for translation

## 🔧 API Endpoints

- `POST /predict` - Real-time sign language prediction
- `GET /custom/labels` - Get available custom signs
- `POST /custom/add` - Add new custom sign samples
- `GET /history` - Get user translation history
- `POST /history/save` - Save translation to history

## 📊 Model Information

- **Dataset**: ASL Alphabet with 30 classes (A-Z, SPACE, DELETE, NOTHING)
- **Architecture**: Custom CNN with MediaPipe hand landmarks
- **Training Data**: 3000+ samples per class
- **Accuracy**: Optimized for real-time performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- MediaPipe team for hand landmark detection
- TensorFlow team for the ML framework
- ASL alphabet dataset contributors
- React and Three.js communities

## 📞 Support

For support, email support@signease.com or join our Discord community.

---

**Made with ❤️ for the deaf and hard-of-hearing community**
