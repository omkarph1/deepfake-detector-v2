import os
import sys
import json
import base64
import tempfile
import traceback
from io import BytesIO

from flask import Flask, request, Response, stream_with_context
from flask_cors import CORS
from PIL import Image

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.mtcnn_extractor import extract_frames
from utils.inference import run_all_models

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

from huggingface_hub import hf_hub_download

# ─── Weight file paths ───────────────────────────────────────────────────────
CONVNEXT_PATH = hf_hub_download(repo_id="Omkarpp/deepguard-weights", filename="best_convnextv2.pth")
XCEPTION_PATH = hf_hub_download(repo_id="Omkarpp/deepguard-weights", filename="best_xception.pth")
RESNEXT_PATH  = hf_hub_download(repo_id="Omkarpp/deepguard-weights", filename="best_resnext_bilstm.pth")

# ─── Load models at startup ──────────────────────────────────────────────────
models_loaded = {"convnext": False, "xception": False, "resnext": False}
loaded_models = {"convnext": None, "xception": None, "resnext": None}

print("Loading models...")

try:
    from models.convnext_model import load_convnext
    loaded_models["convnext"] = load_convnext(CONVNEXT_PATH)
    models_loaded["convnext"] = True
    print("✓ ConvNeXt V2 loaded")
except Exception as e:
    print(f"✗ ConvNeXt V2 failed: {e}")

try:
    from models.xception_model import load_xception
    loaded_models["xception"] = load_xception(XCEPTION_PATH)
    models_loaded["xception"] = True
    print("✓ XceptionNet loaded")
except Exception as e:
    print(f"✗ XceptionNet failed: {e}")

try:
    from models.resnext_bilstm import load_resnext
    loaded_models["resnext"] = load_resnext(RESNEXT_PATH)
    models_loaded["resnext"] = True
    print("✓ ResNeXt50-BiLSTM loaded")
except Exception as e:
    print(f"✗ ResNeXt50-BiLSTM failed: {e}")

print(f"Models ready: {models_loaded}")


# ─── Helper ──────────────────────────────────────────────────────────────────

def frame_to_base64(frame_rgb) -> str:
    """Convert numpy RGB array to base64 JPEG string."""
    pil = Image.fromarray(frame_rgb)
    buf = BytesIO()
    pil.save(buf, format="JPEG", quality=85)
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def sse_event(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return {"status": "ok", "models": models_loaded}


@app.route("/api/detect", methods=["POST"])
def detect():
    if "file" not in request.files:
        return {"error": "No file provided"}, 400

    file = request.files["file"]
    if file.filename == "":
        return {"error": "Empty filename"}, 400

    # Save to temp file
    suffix = os.path.splitext(file.filename)[-1] or ".mp4"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp_path = tmp.name
    try:
        file.save(tmp_path)
        tmp.close()
    except Exception as e:
        return {"error": f"File save failed: {e}"}, 500

    def generate():
        try:
            # Stage 0: File received
            yield sse_event("stage", {"stage": 0, "message": "File received", "progress": 5})

            # Stage 1: MTCNN extraction
            yield sse_event("stage", {"stage": 1, "message": "Extracting faces with MTCNN...", "progress": 20})
            frames = extract_frames(tmp_path)
            yield sse_event("stage", {
                "stage": 1,
                "message": f"MTCNN extraction complete — {len(frames)} frames",
                "progress": 35
            })

            # Stage 2: Model inference
            yield sse_event("stage", {
                "stage": 2,
                "message": "Running 3 models in parallel (4-view TTA)...",
                "progress": 40
            })

            # Run all models in parallel
            agg = run_all_models(loaded_models, frames, device='cpu')

            # Stage 3: individual model labels
            cn = agg.get("convnext", {})
            xc = agg.get("xception", {})
            rn = agg.get("resnext", {})

            yield sse_event("stage", {
                "stage": 3,
                "message": (
                    f"ConvNeXt → {cn.get('label','N/A')} | "
                    f"XceptionNet → {xc.get('label','N/A')} | "
                    f"ResNeXt → {rn.get('label','N/A')}"
                ),
                "progress": 75,
                "model_labels": {
                    "convnext": cn.get("label", "N/A"),
                    "xception": xc.get("label", "N/A"),
                    "resnext": rn.get("label", "N/A")
                }
            })

            # Stage 4: Aggregating (Calculate confidence and majority vote)
            yield sse_event("stage", {"stage": 4, "message": "Aggregating results...", "progress": 85})

            # Stage 5: Done - encode EXACTLY 5 frames for frontend display
            # We want to uniformly sample 5 frames out of the ones extracted to show a representative set
            display_count = 5
            total_extracted = len(frames)
            
            if total_extracted <= display_count:
                middle_frames = frames
            else:
                # Create exactly 5 evenly spaced indices.
                # e.g., for 15 frames: [1, 4, 7, 10, 13]
                step = total_extracted / display_count
                indices = [int(step / 2 + i * step) for i in range(display_count)]
                middle_frames = [frames[i] for i in indices]

            # Convert subset of numpy RGB frames to base64 JPEG strings
            encoded_frames = [frame_to_base64(f) for f in middle_frames]

            # Stage 5: Inform frontend that backend processing is complete
            yield sse_event("stage", {"stage": 5, "message": "Analysis complete!", "progress": 100})

            # Final result
            result = {
                "verdict": agg["verdict"],
                "confidence_tier": agg["confidence_tier"],
                "avg_confidence": agg["avg_confidence"],
                "votes_fake": agg["votes_fake"],
                "convnext": cn,
                "xception": xc,
                "resnext": rn,
                "frames": encoded_frames,
                "num_frames": len(frames),
                "processing_stages": [
                    "Uploading",
                    "Extracting Faces (MTCNN)",
                    "Running Models (Parallel)",
                    "Aggregating Results"
                ]
            }
            yield sse_event("result", result)

        except Exception as e:
            traceback.print_exc()
            yield sse_event("error", {"message": str(e)})
        finally:
            try:
                os.unlink(tmp_path)
            except Exception:
                pass

    headers = {
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream"
    }
    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers=headers
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    app.run(host="0.0.0.0", port=port, debug=False)
