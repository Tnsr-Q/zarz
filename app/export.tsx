import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Github, Upload, Check } from 'lucide-react-native';
import { CRTEffect } from '@/components/CRTEffect';
import { useKnowledge } from '@/providers/KnowledgeProvider';
import { generateKnowledgeFile } from '@/utils/knowledgeGenerator';

export default function ExportScreen() {
  const [repoUrl, setRepoUrl] = useState('');
  const [fileName, setFileName] = useState('knowledge.md');
  const [isExporting, setIsExporting] = useState(false);
  const { conversationHistory } = useKnowledge();

  const handleExport = async () => {
    if (!repoUrl.trim()) {
      Alert.alert('Error', 'Please enter a GitHub repository URL');
      return;
    }

    if (conversationHistory.length === 0) {
      Alert.alert('Error', 'No conversations to export');
      return;
    }

    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Export Complete',
        `Successfully exported ${conversationHistory.length} conversations to ${fileName}`,
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export to GitHub');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <CRTEffect />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.monitor}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color="#4ade80" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>EXPORT TO GITHUB</Text>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.infoBox}>
              <Github size={32} color="#4ade80" />
              <Text style={styles.infoTitle}>GITHUB INTEGRATION</Text>
              <Text style={styles.infoText}>
                Export your optimized knowledge files directly to a GitHub repository
              </Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>REPOSITORY URL:</Text>
              <TextInput
                style={styles.input}
                value={repoUrl}
                onChangeText={setRepoUrl}
                placeholder="https://github.com/username/repo"
                placeholderTextColor="#2a5a2a"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>FILE NAME:</Text>
              <TextInput
                style={styles.input}
                value={fileName}
                onChangeText={setFileName}
                placeholder="knowledge.md"
                placeholderTextColor="#2a5a2a"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.statsBox}>
              <Text style={styles.statsTitle}>EXPORT SUMMARY:</Text>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Conversations:</Text>
                <Text style={styles.statValue}>{conversationHistory.length}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Format:</Text>
                <Text style={styles.statValue}>Optimized Markdown</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Chunking:</Text>
                <Text style={styles.statValue}>Semantic</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
              onPress={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Upload size={16} color="#0a0f0a" />
                  <Text style={styles.exportButtonText}>EXPORTING...</Text>
                </>
              ) : (
                <>
                  <Github size={16} color="#0a0f0a" />
                  <Text style={styles.exportButtonText}>EXPORT TO GITHUB</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.helpBox}>
              <Text style={styles.helpTitle}>OPTIMIZATION APPLIED:</Text>
              <Text style={styles.helpText}>
                • Clear hierarchical structure{'\n'}
                • Semantic chunking with overlap{'\n'}
                • Descriptive headings & metadata{'\n'}
                • Q&A format for conversations{'\n'}
                • Keyword-rich content
              </Text>
            </View>
          </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2a5a2a',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 2,
    textShadowColor: '#4ade80',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  infoBox: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
    backgroundColor: '#1a2a1a',
    borderWidth: 1,
    borderColor: '#2a5a2a',
    borderRadius: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 11,
    color: '#3a7a3a',
    textAlign: 'center',
    lineHeight: 16,
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    padding: 12,
    backgroundColor: '#1a2a1a',
    borderWidth: 1,
    borderColor: '#2a5a2a',
    borderRadius: 4,
    fontSize: 12,
    color: '#4ade80',
    fontFamily: 'monospace',
  },
  statsBox: {
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#1a2a1a',
    borderWidth: 1,
    borderColor: '#2a5a2a',
    borderRadius: 4,
  },
  statsTitle: {
    fontSize: 11,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 1,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#3a7a3a',
  },
  statValue: {
    fontSize: 11,
    fontWeight: 'bold' as const,
    color: '#4ade80',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#4ade80',
    borderRadius: 4,
    gap: 8,
    marginBottom: 24,
  },
  exportButtonDisabled: {
    opacity: 0.5,
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#0a0f0a',
    letterSpacing: 1,
  },
  helpBox: {
    padding: 16,
    backgroundColor: '#1a2a1a',
    borderWidth: 1,
    borderColor: '#2a5a2a',
    borderRadius: 4,
  },
  helpTitle: {
    fontSize: 11,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 1,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 10,
    color: '#3a7a3a',
    lineHeight: 16,
  },
});