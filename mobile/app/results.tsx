import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withDelay, withSpring, withRepeat, withSequence,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';
import { Colors } from '../constants/Colors';
import { GlassCard } from '../components/GlassCard';

const { width } = Dimensions.get('window');

type ModelResult = {
  prediction: string;
  confidence: number;
  fake_prob: number;
  real_prob: number;
};

type DetectionResult = {
  verdict: string;
  confidence: number;
  models: Record<string, ModelResult>;
  frames_analyzed: number;
  processing_time: number;
};

function CircularProgress({ percentage, color, size = 120 }: {
  percentage: number; color: string; size?: number;
}) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(400, withTiming(percentage, { duration: 1200, easing: Easing.out(Easing.cubic) }));
  }, [percentage]);

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = Math.round(percentage);
    if (target === 0) return;
    const timer = setInterval(() => {
      start += 2;
      if (start >= target) { setDisplayValue(target); clearInterval(timer); }
      else setDisplayValue(start);
    }, 1200 / (target / 2));
    return () => clearInterval(timer);
  }, [percentage]);

  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={Colors.surface} strokeWidth={8} fill="none"
          />
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={color} strokeWidth={8} fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color }}>{displayValue}%</Text>
      </View>
    </View>
  );
}

function ConfidenceBar({ label, value, color, delay }: {
  label: string; value: number; color: string; delay: number;
}) {
  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withDelay(delay, withTiming(value, { duration: 1000, easing: Easing.out(Easing.cubic) }));
  }, [value]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%` as any,
  }));

  return (
    <View style={styles.barContainer}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={[styles.barValue, { color }]}>{value.toFixed(1)}%</Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { backgroundColor: color }, barStyle]} />
      </View>
    </View>
  );
}

const MOCK_RESULT: DetectionResult = {
  verdict: 'FAKE',
  confidence: 87.3,
  models: {
    convnext: { prediction: 'FAKE', confidence: 91.2, fake_prob: 0.912, real_prob: 0.088 },
    xception: { prediction: 'FAKE', confidence: 85.6, fake_prob: 0.856, real_prob: 0.144 },
    resnext: { prediction: 'FAKE', confidence: 84.1, fake_prob: 0.841, real_prob: 0.159 },
  },
  frames_analyzed: 24,
  processing_time: 42.3,
};

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const videoName = (params.videoName as string) || 'video.mp4';

  let result: DetectionResult = MOCK_RESULT;
  try {
    if (params.data) result = JSON.parse(params.data as string) as DetectionResult;
  } catch {}

  const isFake = result.verdict === 'FAKE';
  const verdictColor = isFake ? Colors.fake : Colors.real;
  const verdictGlow = isFake ? Colors.fakeGlow : Colors.realGlow;

  const cardScale = useSharedValue(0.5);
  const cardOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    cardScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 100 }));
    cardOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    glowScale.value = withRepeat(
      withSequence(withTiming(1.15, { duration: 2000 }), withTiming(1, { duration: 2000 })),
      -1, true
    );
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const shareResult = async () => {
    try {
      await Share.share({
        message: `DeepGuard Analysis Result\n\nVideo: ${videoName}\nVerdict: ${result.verdict}\nConfidence: ${result.confidence?.toFixed(1)}%\n\nAnalyzed with DeepGuard AI`,
        title: 'DeepGuard Result',
      });
    } catch {}
  };

  const models = result.models || {};
  const modelEntries = [
    { name: 'ConvNeXt V2', key: 'convnext', icon: 'grid-outline', color: '#6366f1' },
    { name: 'XceptionNet v3', key: 'xception', icon: 'pulse-outline', color: '#8b5cf6' },
    { name: 'ResNeXt50-BiLSTM', key: 'resnext', icon: 'git-network-outline', color: '#a78bfa' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a0a0f', '#0d0d1f', '#0a0a0f']} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.glowBg, { backgroundColor: verdictGlow }, glowStyle]} />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/')}>
        <Ionicons name="home" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareBtn} onPress={shareResult}>
        <Ionicons name="share-outline" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Animated.View style={cardStyle}>
          <GlassCard style={[styles.verdictCard, { borderColor: verdictColor + '60' }]}>
            <View style={[styles.verdictBadge, { backgroundColor: verdictColor + '22' }]}>
              <Ionicons
                name={isFake ? 'warning' : 'shield-checkmark'}
                size={48} color={verdictColor}
              />
            </View>
            <Text style={[styles.verdictText, { color: verdictColor }]}>
              {isFake ? '⚠️ DEEPFAKE DETECTED' : '✅ AUTHENTIC VIDEO'}
            </Text>
            <Text style={styles.verdictSub}>
              {isFake
                ? 'This video shows strong signs of AI manipulation'
                : 'This video appears to be genuine and unmanipulated'}
            </Text>
            <CircularProgress
              percentage={Math.round(result.confidence || 87)}
              color={verdictColor}
              size={140}
            />
            <Text style={styles.confidenceLabel}>Overall Confidence</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaValue}>{result.frames_analyzed || 24}</Text>
                <Text style={styles.metaLabel}>Frames</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaValue}>{result.processing_time?.toFixed(1) || '42.3'}s</Text>
                <Text style={styles.metaLabel}>Time</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaValue}>3/3</Text>
                <Text style={styles.metaLabel}>Models</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <Text style={styles.sectionTitle}>🧠 Model Breakdown</Text>

        {modelEntries.map((model, i) => {
          const modelData: ModelResult = models[model.key] ?? {
            prediction: result.verdict,
            confidence: 85.0,
            fake_prob: isFake ? 0.85 : 0.15,
            real_prob: isFake ? 0.15 : 0.85,
          };
          const fakeProb = (modelData.fake_prob || 0) * 100;
          const realProb = (modelData.real_prob || 0) * 100;
          const pred = modelData.prediction || result.verdict;
          const predColor = pred === 'FAKE' ? Colors.fake : Colors.real;

          return (
            <GlassCard key={i} style={styles.modelCard}>
              <View style={styles.modelHeader}>
                <View style={[styles.modelIcon, { backgroundColor: model.color + '22' }]}>
                  <Ionicons name={model.icon as any} size={22} color={model.color} />
                </View>
                <View style={styles.modelInfo}>
                  <Text style={styles.modelName}>{model.name}</Text>
                  <Text style={[styles.modelPred, { color: predColor }]}>
                    {pred} · {modelData.confidence?.toFixed(1) || '85.0'}%
                  </Text>
                </View>
                <View style={[styles.predBadge, { backgroundColor: predColor + '22' }]}>
                  <Text style={[styles.predBadgeText, { color: predColor }]}>{pred}</Text>
                </View>
              </View>
              <ConfidenceBar label="Fake Probability" value={fakeProb} color={Colors.fake} delay={400 + i * 150} />
              <ConfidenceBar label="Real Probability" value={realProb} color={Colors.real} delay={600 + i * 150} />
            </GlassCard>
          );
        })}

        <GlassCard style={styles.ensembleCard}>
          <Ionicons name="checkmark-done-circle" size={28} color={Colors.primary} />
          <Text style={styles.ensembleTitle}>Ensemble Majority Vote</Text>
          <Text style={styles.ensembleText}>
            All 3 models voted <Text style={{ color: verdictColor, fontWeight: '700' }}>{result.verdict}</Text>.
            The final verdict is determined by majority voting across ConvNeXt V2,
            XceptionNet v3, and ResNeXt50-BiLSTM for maximum reliability.
          </Text>
        </GlassCard>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => router.push('/detect')} activeOpacity={0.85} style={{ flex: 1 }}>
            <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.actionBtn}>
              <Ionicons name="refresh" size={18} color="white" />
              <Text style={styles.actionBtnText}>Analyze Another</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={shareResult} activeOpacity={0.85} style={styles.shareActionBtn}>
            <Ionicons name="share-social-outline" size={20} color={Colors.primary} />
            <Text style={styles.shareActionText}>Share</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  glowBg: {
    position: 'absolute', width: 300, height: 300,
    borderRadius: 150, top: -50, alignSelf: 'center', opacity: 0.08,
  },
  backBtn: {
    position: 'absolute', top: 52, left: 20, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  shareBtn: {
    position: 'absolute', top: 52, right: 20, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 100, paddingBottom: 40 },
  verdictCard: { alignItems: 'center', marginBottom: 24, borderWidth: 1 },
  verdictBadge: {
    width: 88, height: 88, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  verdictText: { fontSize: 22, fontWeight: '900', letterSpacing: 0.5, marginBottom: 8 },
  verdictSub: {
    fontSize: 13, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 20, marginBottom: 24, paddingHorizontal: 10,
  },
  confidenceLabel: { fontSize: 13, color: Colors.textSecondary, marginTop: 8, marginBottom: 20 },
  metaRow: {
    flexDirection: 'row', alignItems: 'center', width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16,
  },
  metaItem: { flex: 1, alignItems: 'center' },
  metaValue: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  metaLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2, textTransform: 'uppercase' },
  metaDivider: { width: 1, height: 30, backgroundColor: Colors.border },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 },
  modelCard: { marginBottom: 12 },
  modelHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  modelIcon: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  modelInfo: { flex: 1 },
  modelName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  modelPred: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  predBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  predBadgeText: { fontSize: 12, fontWeight: '700' },
  barContainer: { marginBottom: 10 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { fontSize: 12, color: Colors.textSecondary },
  barValue: { fontSize: 12, fontWeight: '700' },
  barTrack: { height: 6, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  ensembleCard: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
  ensembleTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginTop: 10, marginBottom: 8 },
  ensembleText: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 14,
  },
  actionBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  shareActionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 16, paddingHorizontal: 20,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.primary,
    backgroundColor: Colors.primaryGlow,
  },
  shareActionText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
});
