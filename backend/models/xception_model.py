import torch
import torch.nn as nn
import timm


class XceptionDeepfake(nn.Module):
    def __init__(self, modelname='legacy_xception', dropout=0.5, num_classes=2):
        super().__init__()
        self.backbone = timm.create_model(
            modelname,
            pretrained=False,
            num_classes=0,
            drop_rate=dropout
        )
        fd = self.backbone.num_features  # 2048
        self.head = nn.Sequential(
            nn.LayerNorm(fd),
            nn.Dropout(dropout),
            nn.Linear(fd, 512),
            nn.BatchNorm1d(512),
            nn.GELU(),
            nn.Dropout(dropout / 2),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.head(self.backbone(x))


def load_xception(weights_path: str, device='cpu') -> XceptionDeepfake:
    model = XceptionDeepfake()
    state = torch.load(weights_path, map_location=device)
    if isinstance(state, dict) and 'model_state_dict' in state:
        state = state['model_state_dict']
    model.load_state_dict(state)
    model.eval()
    model.to(device)
    return model
