# 🛡️ DeepGuard - Advanced AI Deepfake Detection

DeepGuard is a state-of-the-art, open-source web application designed to detect deepfake and manipulated videos. By leveraging an ensemble of three specialized neural networks running in parallel, DeepGuard provides highly accurate, multi-dimensional analysis of spatial, frequency, and temporal video artifacts. 

The application features a sleek, glassmorphic React frontend that streams real-time inference progress from a PyTorch/Flask backend using Server-Sent Events (SSE).

![DeepGuard UI](https://img.shields.io/badge/UI-React_18_|_Vite-cyan?style=for-the-badge) ![Backend](https://img.shields.io/badge/Backend-Flask_|_PyTorch-blue?style=for-the-badge)

---

## ✨ Key Features

1. **3-Model Parallel Ensemble**: Combines **ConvNeXt V2** (Frame-level spatial CNN), **XceptionNet v3** (Frequency/Compression CNN), and **ResNeXt50-BiLSTM** (Temporal Sequence Model) for multi-angle detection.
2. **Real-time SSE Streaming**: The backend streams extraction and inference progress directly to the frontend, providing a live, step-by-step progress bar and terminal log without polling.
3. **Dual-Probability Metrics**: Models don't just return a single "Fake" score. They inherently calculate both **Real Confidence** and **Fake Confidence** simultaneously, displayed side-by-side in custom interactive SVG Radar and Arc charts.
4. **Majority Voting Logic**: A video is only flagged as `FAKE` if at least 2 out of the 3 neural architectures agree it has been manipulated, minimizing false positives.
5. **Dynamic Theming**: Fully responsive Dark & Light modes meticulously engineered using global CSS variables for high-contrast accessibility across all charts and UI components.
6. **PDF Report Export**: Generate and download high-fidelity graphical PDF reports of the analysis results instantly in the browser.

---

## 🏗️ Technology Stack

**Frontend:**
* React 18 (via Vite)
* Framer Motion (Animations & entry gestures)
* Recharts (Interactive Radar diagrams)
* GSAP (Scroll triggers & hero animations)
* html2canvas & jsPDF (Client-side report generation)

**Backend:**
* Flask (API & SSE Streaming)
* PyTorch (Model Inference)
* MTCNN (Multi-task Cascaded Convolutional Networks for precise face extraction)
* OpenCV & NumPy (Video parsing & tensor manipulation)

---

## 🚀 Installation & Setup

You will need two terminal windows to run both the API and the User Interface.

### 1. Backend Setup (Flask + PyTorch)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: Ensure your `backend/weights` folder contains the required `.pth` model weights (`best_convnextv2.pth`, `best_xception.pth`, `best_resnext_bilstm.pth`) before starting the server.*

4. Start the backend:
   ```bash
   python main.py
   ```
   *The Flask API will initialize the models and listen on `http://localhost:8000`.*

### 2. Frontend Setup (React + Vite)

1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   *The Vite server will start on `http://localhost:5173`. Open this URL in your browser to use the application!*

---

## 📂 Project Structure

```text
deepfake-detector/
├── backend/
│   ├── main.py                # Flask API routes & SSE generator
│   ├── inference.py           # PyTorch ensemble execution
│   ├── utils/
│   │   └── mtcnn_extractor.py # Video frame reading & Face cropping
│   ├── models/                # PyTorch neural network definitions
│   └── weights/               # .pth trained model weights
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx            # Main view aggregator & Scroll Logic
        ├── index.css          # Global CSS Variables & Light/Dark Theme maps
        └── components/
            ├── UploadZone.jsx # SSE stream listener & Dropzone UI
            ├── ResultsPanel.jsx # Analytics dashboard aggregator
            ├── RadarChart.jsx # Recharts Dual-Probability implementation
            ├── PDFExport.jsx  # Client-side canvas painting & PDF generation
            └── ...
```

---

## 📖 Further Reading
For a deep-dive into how the data flows through the application, how MTCNN extracts frames, or why this specific ensemble was chosen, please refer to the `walkthrough.md` file located in the root directory.
