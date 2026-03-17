import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withDelay, Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { GlassCard } from '../components/GlassCard';
import { AnimatedHeader } from '../components/AnimatedHeader';
import { REMOTE_IMAGES } from '../constants/Api';

const { width } = Dimensions.get('window');

const MODELS = [
  {
    name: 'ConvNeXt V2',
    role: 'Spatial CNN',
    desc: 'Detects frame-level spatial artifacts and pixel-level manipulation signatures.',
    icon: 'grid-outline',
    accuracy: '90.39%',
    auc: '0.9559',
    color: '#6366f1',
  },
  {
    name: 'XceptionNet v3',
    role: 'Frequency CNN',
    desc: 'Analyzes compression artifacts and frequency-domain inconsistencies.',
    icon: 'pulse-outline',
    accuracy: '87.96%',
    auc: '0.9443',
    color: '#8b5cf6',
  },
  {
    name: 'ResNeXt50-BiLSTM',
    role: 'Temporal Model',
    desc: 'Captures temporal inconsistencies across video frame sequences.',
    icon: 'git-network-outline',
    accuracy: '89.98%',
    auc: '0.9500',
    color: '#a78bfa',
  },
];

const FEATURES = [
  { icon: 'layers-outline', title: 'Ensemble Voting', desc: 'Majority vote across 3 models for robust final verdict' },
  { icon: 'flash-outline', title: 'Real-time SSE', desc: 'Live streaming inference progress without polling' },
  { icon: 'eye-outline', title: 'MTCNN Face Extraction', desc: 'Zero-rejection face detection before analysis' },
  { icon: 'repeat-outline', title: 'Test-Time Augmentation', desc: 'TTA boosts accuracy by averaging multiple passes' },
];

function AnimatedCard({ children, delay, style }: any) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animStyle, style]}>{children}</Animated.View>;
}

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a0a0f', '#0d0d1f', '#0a0a0f']} style={StyleSheet.absoluteFill} />

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <AnimatedHeader
          title="About DeepGuard"
          subtitle="A state-of-the-art ensemble AI system for deepfake video detection"
        />

        {/* Hero Image */}
        <AnimatedCard delay={200}>
          <Image
            source={{ uri: REMOTE_IMAGES.deepfakeDetector }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </AnimatedCard>

        {/* Mission */}
        <AnimatedCard delay={300}>
          <GlassCard style={styles.missionCard}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.primary} />
            <Text style={styles.missionTitle}>Our Mission</Text>
            <Text style={styles.missionText}>
              DeepGuard combines three specialized neural networks running in parallel to provide
              highly accurate, multi-dimensional analysis of spatial, frequency, and temporal
              video artifacts — making deepfake detection accessible to everyone.
            </Text>
          </GlassCard>
        </AnimatedCard>

        {/* Models */}
        <AnimatedCard delay={400}>
          <Text style={styles.sectionTitle}>🧠 AI Models</Text>
        </AnimatedCard>

        {MODELS.map((model, i) => (
          <AnimatedCard key={i} delay={500 + i * 100}>
            <GlassCard style={styles.modelCard}>
              <View style={styles.modelHeader}>
                <View style={[styles.modelIcon, { backgroundColor: model.color + '33' }]}>
                  <Ionicons name={model.icon as any} size={24} color={model.color} />
                </View>
                <View style={styles.modelInfo}>
                  <Text style={styles.modelName}>{model.name}</Text>
                  <Text style={[styles.modelRole, { color: model.color }]}>{model.role}</Text>
                </View>
              </View>
              <Text style={styles.modelDesc}>{model.desc}</Text>
              <View style={styles.modelStats}>
                <View style={styles.modelStat}>
                  <Text style={styles.modelStatValue}>{model.accuracy}</Text>
                  <Text style={styles.modelStatLabel}>Accuracy</Text>
                </View>
                <View style={styles.modelStatDivider} />
                <View style={styles.modelStat}>
                  <Text style={styles.modelStatValue}>{model.auc}</Text>
                  <Text style={styles.modelStatLabel}>AUC Score</Text>
                </View>
              </View>
            </GlassCard>
          </AnimatedCard>
        ))}

        {/* Features */}
        <AnimatedCard delay={800}>
          <Text style={styles.sectionTitle}>⚡ Key Features</Text>
        </AnimatedCard>

        <AnimatedCard delay={900}>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feat, i) => (
              <GlassCard key={i} style={styles.featureCard}>
                <Ionicons name={feat.icon as any} size={28} color={Colors.primary} />
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </GlassCard>
            ))}
          </View>
        </AnimatedCard>

        {/* CTA */}
        <AnimatedCard delay={1000}>
          <TouchableOpacity onPress={() => router.push('/detect')} activeOpacity={0.85}>
            <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.ctaBtn}>
              <Ionicons name="shield-checkmark" size={20} color="white" />
              <Text style={styles.ctaBtnText}>Try DeepGuard Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </AnimatedCard>

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
  heroImage: {
    width: '100%', height: 200, borderRadius: 16,
    marginBottom: 24, borderWidth: 1, borderColor: Colors.border,
  },
  missionCard: { alignItems: 'center', marginBottom: 32 },
  missionTitle: {
    fontSize: 20, fontWeight: '700', color: Colors.textPrimary,
    marginTop: 12, marginBottom: 8,
  },
  missionText: {
    fontSize: 14, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20, fontWeight: '700', color: Colors.textPrimary,
    marginBottom: 16, marginTop: 8,
  },
  modelCard: { marginBottom: 12 },
  modelHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modelIcon: {
    width: 48, height: 48, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  modelInfo: { flex: 1 },
  modelName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  modelRole: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  modelDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  modelStats: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10, padding: 12,
  },
  modelStat: { flex: 1, alignItems: 'center' },
  modelStatValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  modelStatLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2, textTransform: 'uppercase' },
  modelStatDivider: { width: 1, height: 30, backgroundColor: Colors.border },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  featureCard: { width: (width - 52) / 2, alignItems: 'center' },
  featureTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginTop: 8, textAlign: 'center' },
  featureDesc: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', lineHeight: 16, marginTop: 4 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: 14,
  },
  ctaBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
