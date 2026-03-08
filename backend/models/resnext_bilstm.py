import torch
import torch.nn as nn
import torchvision.models as models
from torchvision.models import ResNeXt50_32X4D_Weights


class ResNeXtLSTM(nn.Module):
    def __init__(self, lstm_hidden=1024, lstm_layers=1, dropout=0.4, num_classes=2, bidirectional=True):
        super().__init__()
        bb = models.resnext50_32x4d(weights=ResNeXt50_32X4D_Weights.IMAGENET1K_V1)
        self.stem = nn.Sequential(bb.conv1, bb.bn1, bb.relu, bb.maxpool)
        self.layer1 = bb.layer1
        self.layer2 = bb.layer2
        self.layer3 = bb.layer3
        self.layer4 = bb.layer4
        self.avgpool = bb.avgpool
        self.feat_dim = 2048
        self.lstm = nn.LSTM(
            input_size=2048,
            hidden_size=lstm_hidden,
            num_layers=lstm_layers,
            batch_first=True,
            bidirectional=bidirectional
        )
        lstm_out = lstm_hidden * 2 if bidirectional else lstm_hidden
        self.head = nn.Sequential(
            nn.LayerNorm(lstm_out),
            nn.Dropout(dropout),
            nn.Linear(lstm_out, 512),
            nn.GELU(),
            nn.Dropout(dropout / 2),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):  # x: (B, T, C, H, W)
        B, T, C, H, W = x.shape
        x = x.view(B * T, C, H, W)
        x = self.stem(x)
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        x = self.avgpool(x)
        x = x.view(B, T, self.feat_dim)
        lstm_out, _ = self.lstm(x)
        return self.head(lstm_out[:, -1])


def load_resnext(weights_path: str, device='cpu') -> ResNeXtLSTM:
    model = ResNeXtLSTM()
    state = torch.load(weights_path, map_location=device)
    if isinstance(state, dict) and 'model_state_dict' in state:
        state = state['model_state_dict']
    model.load_state_dict(state)
    model.eval()
    model.to(device)
    return model
