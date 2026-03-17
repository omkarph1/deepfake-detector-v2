import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image, Dimensions, Platform,
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

const { width, height } = Dimensions.get('window');

const NAV_ITEMS = [
  { label: 'Home', icon: 'home', route: '/' },
  { label: 'About', icon: 'information-circle', route: '/about' },
  { label: 'How It Works', icon: 'git-network', route: '/how-it-works' },
  { label: 'Detect', icon: 'shield-checkmark', route: '/detect' },
];

const STATS = [
  { value: '90%+', label: 'Accuracy' },
  { value: '3', label: 'AI Models' },
  { value: '0.95', label: 'AUC Score' },
  { value: 'Real-time', label: 'Analysis' },
];

function FloatingOrb({ delay, size, x, y, color }: any) {
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(
      withSequence(withTiming(0.7, { duration: 3000 }), withTiming(0.3, { duration: 3000 })),
      -1, true
    ));
    scale.value = withDelay(delay, withRepeat(
      withSequence(withTiming(1.2, { duration: 4000 }), withTiming(1, { duration: 4000 })),
      -1, true
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{
      position: 'absolute', width: size, height: size,
      borderRadius: size / 2, backgroundColor: color,
      left: x, top: y,
    }, style]} />
  );
}

export default function HomeScreen() {
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(40);
  const subtitleOpacity = useSharedValue(0);
  const btnScale = useSharedValue(0.8);
  const btnOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 900 }));
    titleY.value = withDelay(300, withTiming(0, { duration: 900, easing: Easing.out(Easing.cubic) }));
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 700 }));
    btnOpacity.value = withDelay(900, withTiming(1, { duration: 600 }));
    btnScale.value = withDelay(900, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));
    pulseScale.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 2000 }), withTiming(1, { duration: 2000 })),
      -1, true
    );
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({ opacity: subtitleOpacity.value }));

  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ scale: btnScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient colors={['#0a0a0f', '#0d0d1f', '#0a0a0f']} style={StyleSheet.absoluteFill} />

      {/* Floating Orbs */}
      <FloatingOrb delay={0} size={200} x={-60} y={100} color={Colors.primaryGlow} />
      <FloatingOrb delay={1000} size={150} x={width - 80} y={300} color="rgba(139,92,246,0.15)" />
      <FloatingOrb delay={2000} size={120} x={width / 2 - 60} y={height - 250} color="rgba(99,102,241,0.1)" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Logo + Title */}
        <Animated.View style={[styles.heroSection, titleStyle]}>
          <Animated.View style={[styles.logoContainer, pulseStyle]}>
            <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.logoGradient}>
              <Ionicons name="shield-checkmark" size={40} color="white" />
            </LinearGradient>
          </Animated.View>
          <Text style={styles.brandName}>DeepGuard</Text>
          <Text style={styles.tagline}>Advanced AI Deepfake Detection</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={subtitleStyle}>
          <Text style={styles.subtitle}>
            Powered by an ensemble of 3 specialized neural networks — ConvNeXt V2, XceptionNet, and ResNeXt50-BiLSTM — for multi-dimensional deepfake analysis.
          </Text>
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View style={[styles.ctaContainer, btnStyle]}>
          <TouchableOpacity onPress={() => router.push('/detect')} activeOpacity={0.85}>
            <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.primaryBtn}>
              <Ionicons name="shield-checkmark" size={20} color="white" />
              <Text style={styles.primaryBtnText}>Detect Deepfake</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/how-it-works')} activeOpacity={0.85}>
            <View style={styles.secondaryBtn}>
              <Ionicons name="play-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.secondaryBtnText}>How It Works</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsGrid, btnStyle]}>
          {STATS.map((stat, i) => (
            <GlassCard key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </GlassCard>
          ))}
        </Animated.View>

        {/* Nav Cards */}
        <Animated.View style={[styles.navGrid, btnStyle]}>
          {NAV_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} onPress={() => router.push(item.route as any)} activeOpacity={0.8}>
              <GlassCard style={styles.navCard}>
                <Ionicons name={item.icon as any} size={28} color={Colors.primary} />
                <Text style={styles.navLabel}>{item.label}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 80, paddingBottom: 40 },
  heroSection: { alignItems: 'center', marginBottom: 24 },
  logoContainer: { marginBottom: 16 },
  logoGradient: {
    width: 80, height: 80, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
  },
  brandName: {
    fontSize: 42, fontWeight: '900', color: Colors.textPrimary,
    letterSpacing: -1, marginBottom: 8,
  },
  tagline: { fontSize: 16, color: Colors.primary, fontWeight: '600', letterSpacing: 0.5 },
  subtitle: {
    fontSize: 15, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 24, marginBottom: 32, paddingHorizontal: 10,
  },
  ctaContainer: { gap: 12, marginBottom: 32 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, paddingHorizontal: 32,
    borderRadius: 14,
  },
  primaryBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 14, paddingHorizontal: 32,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.primary,
    backgroundColor: Colors.primaryGlow,
  },
  secondaryBtnText: { color: Colors.primary, fontSize: 17, fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    justifyContent: 'center', marginBottom: 32,
  },
  statCard: { width: (width - 64) / 2, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  navGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
  },
  navCard: { width: (width - 64) / 2, alignItems: 'center', gap: 8 },
  navLabel: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', marginTop: 4 },
});
