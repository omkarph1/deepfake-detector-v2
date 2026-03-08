import cv2
import numpy as np
from facenet_pytorch import MTCNN
from PIL import Image
import torch

# Initialize MTCNN with specified parameters
# post_process=False is CRITICAL to keep output in [0, 255] range 
# instead of [-1, 1], avoiding black frames when converting to uint8.
mtcnn = MTCNN(
    image_size=224,
    margin=20,
    min_face_size=20,
    thresholds=[0.5, 0.6, 0.6],
    select_largest=True,
    post_process=False,  # <-- Keeps values between 0 and 255
    keep_all=False,
    device='cpu'
)

NUM_FRAMES = 15


def _center_crop_fallback(frame_bgr: np.ndarray) -> np.ndarray:
    """Fallback center crop when MTCNN detects no face."""
    img = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    h, w = img.shape[:2]
    size = min(h, w)
    top = (h - size) // 2
    left = (w - size) // 2
    img = img[top:top + size, left:left + size]
    img = cv2.resize(img, (224, 224), interpolation=cv2.INTER_AREA)
    return img


def extract_frames(video_path: str) -> list:
    """
    Extract NUM_FRAMES frames at uniform intervals from the video.
    For each frame, attempt MTCNN face detection; fallback to center crop.
    
    Args:
        video_path (str): The absolute or relative path to the input video.
        
    Returns:
        list: A list of exactly NUM_FRAMES RGB numpy arrays (H, W, 3) of type uint8.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Cannot open video: {video_path}")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    total_frames = max(total_frames, 1)

    # Uniform interval indices
    indices = [int(i * total_frames / NUM_FRAMES) for i in range(NUM_FRAMES)]

    raw_frames = []
    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if ret:
            raw_frames.append(frame)
        elif raw_frames:
            raw_frames.append(raw_frames[-1])  # duplicate last frame
    cap.release()

    # Pad if needed
    while len(raw_frames) < NUM_FRAMES:
        raw_frames.append(raw_frames[-1] if raw_frames else np.zeros((224, 224, 3), dtype=np.uint8))

    # Trim to exactly NUM_FRAMES
    raw_frames = raw_frames[:NUM_FRAMES]

    # Process each frame with MTCNN
    processed = []
    for frame_bgr in raw_frames:
        frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(frame_rgb)
        try:
            with torch.no_grad():
                face_tensor = mtcnn(pil_img)
            if face_tensor is not None:
                # face_tensor is (C, H, W) with values in [0, 255]
                face_np = face_tensor.permute(1, 2, 0).cpu().numpy()
                face_np = np.clip(face_np, 0, 255).astype(np.uint8)
                processed.append(face_np)
            else:
                processed.append(_center_crop_fallback(frame_bgr))
        except Exception:
            processed.append(_center_crop_fallback(frame_bgr))

    return processed
