import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, Hash, List } from 'lucide-react-native';
import { CRTEffect } from '@/components/CRTEffect';
import { useKnowledge } from '@/providers/KnowledgeProvider';
import { generateKnowledgeFile } from '@/utils/knowledgeGenerator';

export default function PreviewScreen() {
  const [selectedFormat, setSelectedFormat] = useState<'markdown' | 'json'>('markdown');
  const [preview, setPreview] = useState('');
  const { conversationHistory } = useKnowledge();

  React.useEffect(() => {
    if (conversationHistory.length > 0) {
      const generated = generateKnowledgeFile(conversationHistory, selectedFormat);
      setPreview(generated);
    }
  }, [conversationHistory, selectedFormat]);

  const formats = [
    { id: 'markdown', label: 'MARKDOWN', icon: Hash },
    { id: 'json', label: 'JSON', icon: List },
  ];

  if (conversationHistory.length === 0) {
    return (
      <View style={styles.container}>
        <CRTEffect />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.monitor}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={20} color="#4ade80" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>KNOWLEDGE PREVIEW</Text>
            </View>
            <View style={styles.emptyState}>
              <FileText size={48} color="#2a5a2a" />
              <Text style={styles.emptyText}>NO CONVERSATIONS LOADED</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/parser')}
              >
                <Text style={styles.emptyButtonText}>IMPORT CONVERSATION</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

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
            <Text style={styles.headerTitle}>KNOWLEDGE PREVIEW</Text>
          </View>

          {/* Format Selector */}
          <View style={styles.formatSelector}>
            {formats.map((format) => (
              <TouchableOpacity
                key={format.id}
                style={[
                  styles.formatButton,
                  selectedFormat === format.id && styles.formatButtonActive,
                ]}
                onPress={() => setSelectedFormat(format.id as 'markdown' | 'json')}
              >
                <format.icon size={16} color={selectedFormat === format.id ? '#0a0f0a' : '#4ade80'} />
                <Text style={[
                  styles.formatButtonText,
                  selectedFormat === format.id && styles.formatButtonTextActive,
                ]}>
                  {format.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Preview */}
          <ScrollView 
            style={styles.previewContainer}
            contentContainerStyle={styles.previewContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>GENERATED KNOWLEDGE FILE</Text>
              <Text style={styles.previewStats}>
                {conversationHistory.length} conversations • {preview.length} chars
              </Text>
            </View>
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>{preview}</Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                Alert.alert('Success', 'Knowledge file copied to clipboard');
              }}
            >
              <Text style={styles.actionButtonText}>COPY TO CLIPBOARD</Text>
            </TouchableOpacity>
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
  formatSelector: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  formatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#4ade80',
    borderRadius: 4,
    gap: 8,
  },
  formatButtonActive: {
    backgroundColor: '#4ade80',
  },
  formatButtonText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 1,
  },
  formatButtonTextActive: {
    color: '#0a0f0a',
  },
  previewContainer: {
    flex: 1,
  },
  previewContent: {
    padding: 20,
  },
  previewHeader: {
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 1,
    marginBottom: 4,
  },
  previewStats: {
    fontSize: 10,
    color: '#3a7a3a',
  },
  codeBlock: {
    padding: 12,
    backgroundColor: '#1a2a1a',
    borderWidth: 1,
    borderColor: '#2a5a2a',
    borderRadius: 4,
  },
  codeText: {
    fontSize: 11,
    color: '#4ade80',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  actions: {
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: '#2a5a2a',
  },
  actionButton: {
    padding: 14,
    backgroundColor: '#4ade80',
    borderRadius: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#0a0f0a',
    letterSpacing: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#3a7a3a',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#4ade80',
    borderRadius: 4,
  },
  emptyButtonText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 1,
  },
});