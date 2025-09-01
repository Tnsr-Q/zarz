import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export function CRTEffect() {
  const scanlineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scanlineAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateY = scanlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-height, height * 2],
  });

  return (
    <>
      {/* Scanlines */}
      <Animated.View
        style={[
          styles.scanline,
          {
            transform: [{ translateY }],
          },
        ]}
        pointerEvents="none"
      />
      
      {/* Screen flicker effect */}
      <View style={styles.flicker} pointerEvents="none" />
      
      {/* Vignette effect */}
      <View style={styles.vignette} pointerEvents="none" />
    </>
  );
}

const styles = StyleSheet.create({
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#4ade80',
    opacity: 0.1,
    zIndex: 999,
  },
  flicker: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4ade80',
    opacity: 0.02,
    zIndex: 998,
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 997,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 100,
  },
});