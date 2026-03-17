import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withDelay, withRepeat, withSequence, Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { GlassCard } from '../components/GlassCard';
import { AnimatedHeader } from '../components/AnimatedHeader';
import { REMOTE_IMAGES } from '../constants/Api';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    step: '01',
    title: 'Upload Video',
    desc: 'Select a video file from your device. Supports MP4, AVI, MOV formats up to 100MB.',
    icon: 'cloud-upload-outline',
    color: '#6366f1',
  },
  {
    step: '02',
    title: 'MTCNN Face Extraction',
    desc: 'Multi-task Cascaded CNN detects and extracts face regions from every frame with zero-rejection policy.',
    icon: 'scan-outline',
    color: '#8b5cf6',
  },
  {
    step: '03',
    title: 'Parallel Inference',
    desc: 'All 3 models — ConvNeXt V2, XceptionNet, ResNeXt50-BiLSTM — analyze the frames simultaneously.',
    icon: 'git-branch-outline',
    color: '#a78bfa',
  },
  {
    step: '04',
    title: 'Test-Time Augmentation',
    desc: 'TTA applies multiple transformations and averages predictions to boost accuracy and reduce variance.',
    icon: 'repeat-outline',
    color: '#7c3aed',
  },
  {
    step: '05',
    title: 'Ensemble Voting',
    desc: 'Majority voting across all 3 model predictions determines the final REAL or FAKE verdict.',
    icon: 'checkmark-circle-outline',
    color: '#6366f1',
  },
  {
    step: '06',
    title: 'Results & Report',
    desc: 'Get detailed confidence scores per model, probability charts, and a downloadable PDF report.',
    icon: 'bar-chart-outline',
    color: '#10b981',
  },
];

const TECH = [
  { label: 'Framework', value: 'React Native + Expo' },
  { label: 'Backend', value: 'Flask + PyTorch' },
  { label: 'Face Detection', value: 'MTCNN' },
  { label: 'Streaming', value: 'Server-Sent Events' },
  { label: 'Hosted On', value: 'HuggingFace Spaces' },
  { label: 'Model Format', value: 'PyTorch .pth' },
];

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(index % 2 === 0 ? -40 : 40);

  useEffect(() => {
    opacity.value = withDelay(300 + index * 150, withTiming(1, { duration: 600 }));
    translateX.value = withDelay(300 + index * 150, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const pulseScale = useSharedValue(1);
  useEffect(() => {
    pulseScale.value = withDelay(index * 200, withRepeat(
      withSequence(withTiming(1.1, { duration: 1500 }), withTiming(1, { duration: 1500 })),
      -1, true
    ));
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }] }));

  return (
    <Animated.View style={animStyle}>
      <GlassCard style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <Animated.View style={[styles.stepIconContainer, { backgroundColor: step.color + '22' }, pulseStyle]}>
            <Ionicons name={step.icon as any} size={26} color={step.color} />
          </Animated.View>
          <View style={styles.stepBadge}>
            <Text style={[styles.stepNumber, { color: step.color }]}>{step.step}</Text>
          </View>
        </View>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepDesc}>{step.desc}</Text>
      </GlassCard>
    </Animated.View>
  );
}

export default function HowItWorksScreen() {
  const lineHeight = useSharedValue(0);

  useEffect(() => {
    lineHeight.value = withDelay(500, withTiming(1, { duration: 2000 }));
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a0a0f', '#0d0d1f', '#0a0a0f']} style={StyleSheet.absoluteFill} />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <AnimatedHeader
          title="How It Works"
          subtitle="6-step pipeline powered by 3 parallel AI models"
        />

        {/* Pipeline Image */}
        <Animated.View style={{ opacity: useSharedValue(1) }}>
          <Image
            source={{ uri: REMOTE_IMAGES.deepfakeImage }}
            style={styles.pipelineImage}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Steps */}
        <Text style={styles.sectionTitle}>🔬 Detection Pipeline</Text>
        {STEPS.map((step, i) => (
          <StepCard key={i} step={step} index={i} />
        ))}

        {/* Tech Stack */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>⚙️ Tech Stack</Text>
        <GlassCard>
          {TECH.map((item, i) => (
            <View key={i} style={[styles.techRow, i < TECH.length - 1 && styles.techRowBorder]}>
              <Text style={styles.techLabel}>{item.label}</Text>
              <Text style={styles.techValue}>{item.value}</Text>
            </View>
          ))}
        </GlassCard>

        {/* CTA */}
        <TouchableOpacity
          onPress={() => router.push('/detect')}
          activeOpacity={0.85}
          style={{ marginTop: 32 }}
        >
          <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.ctaBtn}>
            <Ionicons name="shield-checkmark" size={20} color="white" />
            <Text style={styles.ctaBtnText}>Start Detection</Text>
          </LinearGradient>
        </TouchableOpacity>

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
  pipelineImage: {
    width: '100%', height: 180, borderRadius: 16,
    marginBottom: 32, borderWidth: 1, borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16,
  },
  stepCard: { marginBottom: 12 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  stepIconContainer: {
    width: 52, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  stepBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  stepNumber: { fontSize: 16, fontWeight: '800' },
  stepTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  stepDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  techRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
  },
  techRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  techLabel: { fontSize: 13, color: Colors.textSecondary },
  techValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: 14,
  },
  ctaBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
