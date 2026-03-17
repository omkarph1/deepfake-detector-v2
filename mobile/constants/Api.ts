export const API = {
  BASE_URL: 'https://Omkarpp-deepguard-api.hf.space',
  DETECT: '/api/detect',
  STREAM: '/api/stream',
  HEALTH: '/api/detect',
};

const GITHUB_RAW = 'https://raw.githubusercontent.com/omkarph1/deepfake-detector-v2/v2-development/frontend/public/images';

export const REMOTE_IMAGES = {
  hero: `${GITHUB_RAW}/hero-deepfake.jpg`,
  deepfakeDetector: `${GITHUB_RAW}/Deepfake_Detector.jpg`,
  deepfakeImage: `${GITHUB_RAW}/deepfake_image.jpg`,
  deepfakeImg: `${GITHUB_RAW}/deepfake_img.png`,
};

export const LOCAL_IMAGES = {
  icon: require('../assets/icon.png'),
  splash: require('../assets/splash-icon.png'),
};
