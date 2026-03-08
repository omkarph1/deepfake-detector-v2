import torch
import torch.nn as nn
import timm


class ConvNeXtV2Deepfake(nn.Module):
    def __init__(self, modelname='convnextv2_base', dropout=0.4, drop_path_rate=0.2, num_classes=2):
        super().__init__()
        self.backbone = timm.create_model(
            modelname,
            pretrained=False,
            num_classes=0,
            drop_rate=dropout,
            drop_path_rate=drop_path_rate
        )
        fd = self.backbone.num_features
        self.head = nn.Sequential(
            nn.LayerNorm(fd),
            nn.Dropout(dropout),
            nn.Linear(fd, 512),
            nn.GELU(),
            nn.Dropout(dropout / 2),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.head(self.backbone(x))


def load_convnext(weights_path: str, device='cpu') -> ConvNeXtV2Deepfake:
    model = ConvNeXtV2Deepfake()
    state = torch.load(weights_path, map_location=device)
    if isinstance(state, dict) and 'model_state_dict' in state:
        state = state['model_state_dict']
    model.load_state_dict(state)
    model.eval()
    model.to(device)
    return model
