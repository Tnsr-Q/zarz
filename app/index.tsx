import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Database, Github, Settings } from 'lucide-react-native';
import { CRTEffect } from '@/components/CRTEffect';
import { useKnowledge } from '@/providers/KnowledgeProvider';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const scanlineAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.8)).current;
  const { conversationHistory } = useKnowledge();

  useEffect(() => {
    // Scanline animation
    Animated.loop(
      Animated.timing(scanlineAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    // Glow pulsing
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const menuItems = [
    {
      id: 'parse',
      title: 'PARSE CONVERSATION',
      subtitle: 'Import & analyze LLM chats',
      icon: FileText,
      route: 'parser',
    },
    {
      id: 'preview',
      title: 'VIEW KNOWLEDGE',
      subtitle: `${conversationHistory.length} conversations loaded`,
      icon: Database,
      route: 'preview',
    },
    {
      id: 'export',
      title: 'EXPORT TO GITHUB',
      subtitle: 'Generate optimized files',
      icon: Github,
      route: 'export',
    },
  ];

  return (
    <View style={styles.container}>
      <CRTEffect />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.monitor}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>ZARZ CRT MONITOR</Text>
            <Text style={styles.headerSubtitle}>Knowledge Parser v1.0</Text>
          </View>

          {/* Main Content */}
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.statusBar}>
              <Text style={styles.statusText}>SYSTEM READY</Text>
              <Animated.View 
                style={[
                  styles.statusDot,
                  { opacity: glowAnim }
                ]}
              />
            </View>

            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View style={styles.menuIcon}>
                  <item.icon size={24} color="#4ade80" />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.menuArrow}>{'>'}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>OPTIMAL FORMATS</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>• MARKDOWN</Text>
                <Text style={styles.infoValue}>Clean & explicit</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>• JSON</Text>
                <Text style={styles.infoValue}>Structured data</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>• PLAIN TEXT</Text>
                <Text style={styles.infoValue}>Universal</Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>TERMINAL MODE: ACTIVE</Text>
            <Text style={styles.footerText}>MEM: 64KB FREE</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f0a',
  },
  safeArea: {
    flex: 1,
  },
  monitor: {
    flex: 1,
    margin: 16,
    borderWidth: 2,
    borderColor: '#4ade80',
    borderRadius: 8,
    backgroundColor: '#0d1a0d',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2a5a2a',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 2,
    textShadowColor: '#4ade80',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#3a7a3a',
    marginTop: 4,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1a2a1a',
    borderRadius: 4,
  },
  statusText: {
    flex: 1,
    fontSize: 12,
    color: '#4ade80',
    letterSpacing: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#1a2a1a',
    borderWidth: 1,
    borderColor: '#2a5a2a',
    borderRadius: 4,
  },
  menuIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#0d1a0d',
    borderWidth: 1,
    borderColor: '#4ade80',
    borderRadius: 4,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 1,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#3a7a3a',
  },
  menuArrow: {
    fontSize: 20,
    color: '#4ade80',
    marginLeft: 8,
  },
  infoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#1a2a1a',
    borderWidth: 1,
    borderColor: '#2a5a2a',
    borderRadius: 4,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 11,
    color: '#4ade80',
  },
  infoValue: {
    fontSize: 11,
    color: '#3a7a3a',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderTopWidth: 2,
    borderTopColor: '#2a5a2a',
  },
  footerText: {
    fontSize: 10,
    color: '#3a7a3a',
    letterSpacing: 1,
  },
});