import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
}

export function AnimatedHeader({ title, subtitle }: AnimatedHeaderProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(100, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(100, withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.divider} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 24 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: 16,
  },
});
