import numpy as np
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Optional, Dict, Any

THRESHOLD = 0.50

# Normalization constants
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]


def _build_tta_transforms(target_size: int):
    """Build 4 TTA transforms for a given target size."""
    normalize = transforms.Normalize(mean=MEAN, std=STD)
    return [
        # View 1: Resize + ToTensor + Normalize
        transforms.Compose([
            transforms.Resize((target_size, target_size)),
            transforms.ToTensor(),
            normalize
        ]),
        # View 2: Resize + HFlip + ToTensor + Normalize
        transforms.Compose([
            transforms.Resize((target_size, target_size)),
            transforms.RandomHorizontalFlip(p=1.0),
            transforms.ToTensor(),
            normalize
        ]),
        # View 3: Resize to target+16, CenterCrop + ToTensor + Normalize
        transforms.Compose([
            transforms.Resize((target_size + 16, target_size + 16)),
            transforms.CenterCrop(target_size),
            transforms.ToTensor(),
            normalize
        ]),
        # View 4: Resize + ColorJitter + ToTensor + Normalize
        transforms.Compose([
            transforms.Resize((target_size, target_size)),
            transforms.ColorJitter(brightness=0.15, contrast=0.15),
            transforms.ToTensor(),
            normalize
        ]),
    ]


def _frames_to_tensor(frames: list, tfm) -> torch.Tensor:
    """Convert list of numpy RGB frames to a batch tensor using the given transform."""
    tensors = []
    for f in frames:
        pil = Image.fromarray(f.astype(np.uint8))
        tensors.append(tfm(pil))
    return torch.stack(tensors)  # (N, C, H, W)


def run_convnext(model, frames: list, device='cpu') -> Dict[str, Any]:
    """Run ConvNeXt V2 inference with 4-view TTA."""
    if model is None:
        return None
    tta_tfms = _build_tta_transforms(224)
    probs_fake = []
    with torch.inference_mode():
        for tfm in tta_tfms:
            batch = _frames_to_tensor(frames, tfm).to(device)  # (N, C, H, W)
            logits = model(batch)
            probs = F.softmax(logits, dim=1)
            probs_fake.append(probs[:, 1].mean().item())
    prob_fake = float(np.mean(probs_fake))
    prob_real = 1.0 - prob_fake
    pred = int(prob_fake > THRESHOLD)
    return {
        "prob": round(prob_fake, 4),
        "prob_real": round(prob_real, 4),
        "pred": pred,
        "label": "FAKE" if pred == 1 else "REAL"
    }


def run_xception(model, frames: list, device='cpu') -> Dict[str, Any]:
    """Run XceptionNet inference with 4-view TTA (299x299 input)."""
    if model is None:
        return None
    tta_tfms = _build_tta_transforms(299)
    probs_fake = []
    with torch.inference_mode():
        for tfm in tta_tfms:
            batch = _frames_to_tensor(frames, tfm).to(device)  # (N, C, H, W)
            logits = model(batch)
            probs = F.softmax(logits, dim=1)
            probs_fake.append(probs[:, 1].mean().item())
    prob_fake = float(np.mean(probs_fake))
    prob_real = 1.0 - prob_fake
    pred = int(prob_fake > THRESHOLD)
    return {
        "prob": round(prob_fake, 4),
        "prob_real": round(prob_real, 4),
        "pred": pred,
        "label": "FAKE" if pred == 1 else "REAL"
    }


def run_resnext(model, frames: list, device='cpu') -> Dict[str, Any]:
    """Run ResNeXt50-BiLSTM inference with 4-view TTA (224x224 sequence input)."""
    if model is None:
        return None
    tta_tfms = _build_tta_transforms(224)
    probs_fake = []
    with torch.inference_mode():
        for tfm in tta_tfms:
            # Build sequence tensor: (1, T, C, H, W)
            batch = _frames_to_tensor(frames, tfm).unsqueeze(0).to(device)
            logits = model(batch)
            probs = F.softmax(logits, dim=1)
            probs_fake.append(probs[:, 1].mean().item())
    prob_fake = float(np.mean(probs_fake))
    prob_real = 1.0 - prob_fake
    pred = int(prob_fake > THRESHOLD)
    return {
        "prob": round(prob_fake, 4),
        "prob_real": round(prob_real, 4),
        "pred": pred,
        "label": "FAKE" if pred == 1 else "REAL"
    }


def run_all_models(models_dict: dict, frames: list, device='cpu') -> Dict[str, Any]:
    """
    Run all 3 models in parallel using ThreadPoolExecutor.
    Returns individual model results + aggregated verdict.
    """
    model_cn = models_dict.get('convnext')
    model_xc = models_dict.get('xception')
    model_rn = models_dict.get('resnext')

    results = {}
    futures_map = {}

    with ThreadPoolExecutor(max_workers=3) as executor:
        if model_cn is not None:
            futures_map[executor.submit(run_convnext, model_cn, frames, device)] = 'convnext'
        if model_xc is not None:
            futures_map[executor.submit(run_xception, model_xc, frames, device)] = 'xception'
        if model_rn is not None:
            futures_map[executor.submit(run_resnext, model_rn, frames, device)] = 'resnext'

        for future in as_completed(futures_map):
            key = futures_map[future]
            try:
                results[key] = future.result()
            except Exception as e:
                results[key] = {"error": str(e), "prob": 0.5, "prob_real": 0.5, "pred": 0, "label": "REAL"}

    # Fill in None for missing models
    cn_res = results.get('convnext') or {"prob": 0.5, "prob_real": 0.5, "pred": 0, "label": "REAL"}
    xc_res = results.get('xception') or {"prob": 0.5, "prob_real": 0.5, "pred": 0, "label": "REAL"}
    rn_res = results.get('resnext') or {"prob": 0.5, "prob_real": 0.5, "pred": 0, "label": "REAL"}

    # Aggregation
    probs = []
    votes_fake = 0
    active_models = 0

    if model_cn is not None:
        probs.append(cn_res["prob"])
        votes_fake += cn_res["pred"]
        active_models += 1

    if model_xc is not None:
        probs.append(xc_res["prob"])
        votes_fake += xc_res["pred"]
        active_models += 1

    if model_rn is not None:
        probs.append(rn_res["prob"])
        votes_fake += rn_res["pred"]
        active_models += 1

    avg_confidence = float(np.mean(probs)) if probs else 0.5
    majority = active_models // 2 + 1
    verdict = "FAKE" if votes_fake >= majority else "REAL"

    # Confidence tier
    all_agree = (votes_fake == active_models or votes_fake == 0)
    if all_agree and avg_confidence > 0.80:
        confidence_tier = "HIGH"
    elif not all_agree and 0.55 <= avg_confidence <= 0.80:
        confidence_tier = "MODERATE"
    elif avg_confidence < 0.55:
        confidence_tier = "BORDERLINE"
    else:
        confidence_tier = "MODERATE"

    return {
        "verdict": verdict,
        "confidence_tier": confidence_tier,
        "avg_confidence": round(avg_confidence, 4),
        "votes_fake": votes_fake,
        "convnext": cn_res,
        "xception": xc_res,
        "resnext": rn_res
    }
