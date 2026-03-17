import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withRepeat, withSequence, Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Colors } from '../constants/Colors';
import { GlassCard } from '../components/GlassCard';
import { AnimatedHeader } from '../components/AnimatedHeader';
import { API } from '../constants/Api';

const { width } = Dimensions.get('window');

const PROGRESS_STEPS = [
  'Uploading video...',
  'Extracting frames with MTCNN...',
  'Running ConvNeXt V2...',
  'Running XceptionNet v3...',
  'Running ResNeXt50-BiLSTM...',
  'Applying Test-Time Augmentation...',
  'Computing ensemble vote...',
  'Finalizing results...',
];

function PulsingRing({ color }: { color: string }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.4, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1, true
    );
    opacity.value = withRepeat(
      withSequence(withTiming(0.1, { duration: 1000 }), withTiming(0.6, { duration: 1000 })),
      -1, true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{
      position: 'absolute', width: 120, height: 120,
      borderRadius: 60, borderWidth: 2, borderColor: color,
    }, style]} />
  );
}

function ProgressBar({ progress }: { progress: number }) {
  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withTiming(progress, { duration: 500, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%` as any,
  }));

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, barStyle]} />
    </View>
  );
}

export default function DetectScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>('');
  const [videoSize, setVideoSize] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');

  const uploadScale = useSharedValue(1);

  useEffect(() => {
    checkApiHealth();
    uploadScale.value = withRepeat(
      withSequence(withTiming(1.03, { duration: 2000 }), withTiming(1, { duration: 2000 })),
      -1, true
    );
  }, []);

  const uploadStyle = useAnimatedStyle(() => ({
    transform: [{ scale: uploadScale.value }],
  }));

  const checkApiHealth = async () => {
    try {
      const res = await fetch(`${API.BASE_URL}${API.DETECT}`, {
        method: 'POST',
        signal: AbortSignal.timeout(8000),
      });
      setApiStatus(res.status < 500 ? 'online' : 'offline');
    } catch {
      setApiStatus('offline');
    }
  };

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow access to your media library to select videos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setVideoUri(asset.uri);
      setVideoName(asset.fileName || 'video.mp4');
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      if (fileInfo.exists && fileInfo.size) {
        const sizeMB = (fileInfo.size / (1024 * 1024)).toFixed(2);
        setVideoSize(`${sizeMB} MB`);
      }
    }
  };

  const simulateProgress = () => {
    let step = 0;
    const interval = setInterval(() => {
      if (step < PROGRESS_STEPS.length) {
        setCurrentStep(step);
        setProgress(Math.round(((step + 1) / PROGRESS_STEPS.length) * 90));
        step++;
      } else {
        clearInterval(interval);
      }
    }, 2500);
    return interval;
  };

  const analyzeVideo = async () => {
    if (!videoUri) return;

    if (apiStatus === 'offline') {
      Alert.alert(
        'API Offline',
        'The DeepGuard API may be sleeping. Please wait 30 seconds and retry.',
        [{ text: 'Retry', onPress: checkApiHealth }, { text: 'Cancel' }]
      );
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep(0);

    const progressInterval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append('video', {
        uri: videoUri,
        name: videoName || 'video.mp4',
        type: 'video/mp4',
      } as any);

      // Step 1: POST to /api/detect → get job_id
      const detectRes = await fetch(`${API.BASE_URL}${API.DETECT}`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(30000),
      });

      if (!detectRes.ok) throw new Error(`Server error: ${detectRes.status}`);

      const detectData = await detectRes.json();

      // If backend returned direct result (no streaming)
      if (detectData.verdict || detectData.result) {
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => {
          setIsAnalyzing(false);
          router.push({
            pathname: '/results',
            params: {
              data: JSON.stringify(detectData.result || detectData),
              videoName,
            },
          });
        }, 500);
        return;
      }

      // Step 2: Poll /api/stream/{job_id} for result
      const jobId = detectData.job_id || detectData.id;
      if (!jobId) throw new Error('No job ID returned from server');

      let attempts = 0;
      const maxAttempts = 40;

      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const streamRes = await fetch(
            `${API.BASE_URL}${API.STREAM}/${jobId}`,
            { signal: AbortSignal.timeout(10000) }
          );

          if (streamRes.ok) {
            const streamData = await streamRes.json();

            if (streamData.status === 'done' || streamData.verdict) {
              clearInterval(pollInterval);
              clearInterval(progressInterval);
              setProgress(100);
              setTimeout(() => {
                setIsAnalyzing(false);
                router.push({
                  pathname: '/results',
                  params: {
                    data: JSON.stringify(streamData.result || streamData),
                    videoName,
                  },
                });
              }, 500);
            }
          }

          if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            clearInterval(progressInterval);
            setIsAnalyzing(false);
            Alert.alert('Timeout', 'Analysis took too long. Please try again.');
          }
        } catch {
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            clearInterval(progressInterval);
            setIsAnalyzing(false);
            Alert.alert('Error', 'Something went wrong while polling results.');
          }
        }
      }, 3000);

    } catch (error: any) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setProgress(0);
      Alert.alert('Analysis Failed', error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a0a0f', '#0d0d1f', '#0a0a0f']} style={StyleSheet.absoluteFill} />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <AnimatedHeader
          title="Detect Deepfake"
          subtitle="Upload a video to analyze with our 3-model AI ensemble"
        />

        {/* API Status */}
        <GlassCard style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, {
              backgroundColor:
                apiStatus === 'online' ? Colors.real :
                apiStatus === 'offline' ? Colors.fake : Colors.warning,
            }]} />
            <Text style={styles.statusText}>
              API: {apiStatus === 'online' ? 'Online ✓' : apiStatus === 'offline' ? 'Offline — tap to retry' : 'Checking...'}
            </Text>
            {apiStatus !== 'online' && (
              <TouchableOpacity onPress={checkApiHealth} style={styles.retryBtn}>
                <Ionicons name="refresh" size={16} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </GlassCard>

        {/* Upload Zone */}
        {!isAnalyzing && (
          <Animated.View style={uploadStyle}>
            <TouchableOpacity onPress={pickVideo} activeOpacity={0.8}>
              <GlassCard style={styles.uploadZone}>
                <View style={styles.uploadIconContainer}>
                  {videoUri ? (
                    <Ionicons name="checkmark-circle" size={56} color={Colors.real} />
                  ) : (
                    <>
                      <PulsingRing color={Colors.primary} />
                      <Ionicons name="cloud-upload-outline" size={56} color={Colors.primary} />
                    </>
                  )}
                </View>
                {videoUri ? (
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>{videoName}</Text>
                    <Text style={styles.fileSize}>{videoSize}</Text>
                    <Text style={styles.tapToChange}>Tap to change video</Text>
                  </View>
                ) : (
                  <View style={styles.uploadText}>
                    <Text style={styles.uploadTitle}>Select Video</Text>
                    <Text style={styles.uploadSubtitle}>MP4, AVI, MOV • Max 100MB</Text>
                  </View>
                )}
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Analyzing State */}
        {isAnalyzing && (
          <GlassCard style={styles.analyzingCard}>
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginBottom: 20 }} />
            <Text style={styles.analyzingTitle}>Analyzing Video</Text>
            <Text style={styles.analyzingStep}>{PROGRESS_STEPS[currentStep]}</Text>
            <ProgressBar progress={progress} />
            <Text style={styles.progressText}>{progress}%</Text>
            <View style={styles.stepsList}>
              {PROGRESS_STEPS.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <Ionicons
                    name={
                      i < currentStep ? 'checkmark-circle' :
                      i === currentStep ? 'ellipse' : 'ellipse-outline'
                    }
                    size={16}
                    color={
                      i < currentStep ? Colors.real :
                      i === currentStep ? Colors.primary : Colors.textMuted
                    }
                  />
                  <Text style={[styles.stepText, {
                    color:
                      i < currentStep ? Colors.real :
                      i === currentStep ? Colors.textPrimary : Colors.textMuted,
                  }]}>{step}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Analyze Button */}
        {!isAnalyzing && (
          <TouchableOpacity
            onPress={analyzeVideo}
            disabled={!videoUri}
            activeOpacity={0.85}
            style={{ marginTop: 20 }}
          >
            <LinearGradient
              colors={videoUri ? [Colors.primary, Colors.secondary] : ['#2a2a3a', '#1a1a2a']}
              style={styles.analyzeBtn}
            >
              <Ionicons name="shield-checkmark" size={22} color="white" />
              <Text style={styles.analyzeBtnText}>
                {videoUri ? 'Analyze Video' : 'Select a Video First'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Info Cards */}
        {!isAnalyzing && (
          <View style={styles.infoGrid}>
            {[
              { icon: 'time-outline', title: 'Processing Time', desc: '30–90 seconds depending on video length' },
              { icon: 'lock-closed-outline', title: 'Privacy', desc: 'Videos are processed and not stored permanently' },
            ].map((item, i) => (
              <GlassCard key={i} style={styles.infoCard}>
                <Ionicons name={item.icon as any} size={22} color={Colors.primary} />
                <Text style={styles.infoTitle}>{item.title}</Text>
                <Text style={styles.infoDesc}>{item.desc}</Text>
              </GlassCard>
            ))}
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backBtn: {
    position: 'absolute', top: 52, left: 20, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 100, paddingBottom: 40 },
  statusCard: { marginBottom: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { flex: 1, fontSize: 13, color: Colors.textSecondary },
  retryBtn: { padding: 4 },
  uploadZone: {
    alignItems: 'center', paddingVertical: 40, marginBottom: 8,
    borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.primary,
  },
  uploadIconContainer: {
    width: 120, height: 120,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  fileInfo: { alignItems: 'center' },
  fileName: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, maxWidth: width - 100 },
  fileSize: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  tapToChange: { fontSize: 12, color: Colors.primary, marginTop: 8 },
  uploadText: { alignItems: 'center' },
  uploadTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  uploadSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 6 },
  analyzingCard: { alignItems: 'center', paddingVertical: 32 },
  analyzingTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  analyzingStep: { fontSize: 14, color: Colors.primary, marginBottom: 20 },
  progressTrack: {
    width: '100%', height: 6, backgroundColor: Colors.surface,
    borderRadius: 3, overflow: 'hidden', marginBottom: 8,
  },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: Colors.primary },
  progressText: { fontSize: 13, color: Colors.textSecondary, marginBottom: 24 },
  stepsList: { width: '100%', gap: 10 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepText: { fontSize: 13, flex: 1 },
  analyzeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 18, borderRadius: 14,
  },
  analyzeBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
  infoGrid: { flexDirection: 'row', gap: 12, marginTop: 20 },
  infoCard: { flex: 1, alignItems: 'center' },
  infoTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginTop: 8, textAlign: 'center' },
  infoDesc: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', lineHeight: 16, marginTop: 4 },
});
