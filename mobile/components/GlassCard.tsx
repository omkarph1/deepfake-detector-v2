import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: any;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 20 }: GlassCardProps) {
  return (
    <BlurView intensity={intensity} tint="dark" style={[styles.card, style]}>
      <View style={styles.inner}>{children}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inner: {
    padding: 20,
    backgroundColor: Colors.surface,
  },
});
