import axios from "axios";
import { useAuth } from "./contexts/AuthContext";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export const api = axios.create({ baseURL: API_BASE });

// Optional authentication - attach Firebase token if available
api.interceptors.request.use(async (config) => {
  try {
    // Get current user from Firebase Auth
    const { getAuth } = await import('./firebase/config');
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      // Get Firebase ID token
      const token = await user.getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.log('No authentication token available, proceeding as guest');
  }
  
  return config;
});

// helper expected by WebcamCapture.jsx
export async function predictFrame(blob) {
  const form = new FormData();
  form.append("frame", blob, "frame.jpg");
  const res = await api.post("/predict", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 8000,
  });
  return res.data; // { prediction, confidence }
}

// Custom signs API
export async function addCustomSign(label, samples) {
  const res = await api.post("/custom/add", {
    label,
    samples
  });
  return res.data;
}

export async function getCustomSigns() {
  const res = await api.get("/custom/list");
  return res.data.labels;
}

export async function deleteCustomSign(label) {
  const res = await api.delete("/custom/delete", {
    params: { label }
  });
  return res.data;
}

// Learning API
export async function getLearningLabels() {
  const res = await api.get("/learn/labels");
  return res.data.labels;
}

export async function evaluateLearning(label, blob) {
  const form = new FormData();
  form.append("frame", blob, "frame.jpg");
  const res = await api.post("/learn/eval", form, {
    params: { label },
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 8000,
  });
  return res.data;
}

export async function setLearningReference(label, blob) {
  const form = new FormData();
  form.append("frame", blob, "frame.jpg");
  const res = await api.post("/learn/set_ref", form, {
    params: { label },
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 8000,
  });
  return res.data;
}
