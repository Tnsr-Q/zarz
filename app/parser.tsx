import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clipboard, Plus, Trash2 } from 'lucide-react-native';
import { CRTEffect } from '@/components/CRTEffect';
import { useKnowledge } from '@/providers/KnowledgeProvider';
import { parseConversation } from '@/utils/conversationParser';

export default function ParserScreen() {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addConversation, conversationHistory, clearHistory } = useKnowledge();

  const handleParse = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please paste a conversation first');
      return;
    }

    setIsProcessing(true);
    try {
      const parsed = await parseConversation(inputText);
      addConversation(parsed);
      setInputText('');
      Alert.alert('Success', `Parsed ${parsed.exchanges.length} exchanges`);
    } catch (error) {
      Alert.alert('Error', 'Failed to parse conversation');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all conversations?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            clearHistory();
            setInputText('');
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CRTEffect />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.monitor}
          behavior={'padding'}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color="#4ade80" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>CONVERSATION PARSER</Text>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.statusBox}>
              <Text style={styles.statusLabel}>CONVERSATIONS LOADED:</Text>
              <Text style={styles.statusValue}>{conversationHistory.length}</Text>
            </View>

            <Text style={styles.instructions}>
              PASTE YOUR LLM CONVERSATION BELOW:{'\n'}
              Supports ChatGPT, Claude, and other formats
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Paste conversation here..."
                placeholderTextColor="#2a5a2a"
                multiline
                textAlignVertical="top"
              />
              <View style={styles.inputStats}>
                <Text style={styles.statsText}>
                  {inputText.length} CHARS
                </Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleParse}
                disabled={isProcessing}
              >
                <Plus size={16} color="#0a0f0a" />
                <Text style={styles.primaryButtonText}>
                  {isProcessing ? 'PROCESSING...' : 'ADD TO KNOWLEDGE'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleClear}
                disabled={conversationHistory.length === 0}
              >
                <Trash2 size={16} color="#4ade80" />
                <Text style={styles.secondaryButtonText}>CLEAR</Text>
              </TouchableOpacity>
            </View>

            {conversationHistory.length > 0 && (
              <View style={styles.historyBox}>
                <Text style={styles.historyTitle}>RECENT IMPORTS:</Text>
                {conversationHistory.slice(-3).map((conv, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Text style={styles.historyText}>
                      • {conv.exchanges.length} exchanges
                    </Text>
                    <Text style={styles.historyDate}>
                      {new Date(conv.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
  statusBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#1a2a1a',
    borderWidth: 1,
    borderColor: '#2a5a2a',
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#3a7a3a',
    letterSpacing: 1,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 1,
  },
  instructions: {
    fontSize: 12,
    color: '#4ade80',
    marginBottom: 16,
    lineHeight: 18,
  },
  inputContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a5a2a',
    borderRadius: 4,
    backgroundColor: '#1a2a1a',
    overflow: 'hidden',
  },
  textInput: {
    minHeight: 200,
    padding: 12,
    fontSize: 12,
    color: '#4ade80',
    fontFamily: 'monospace',
  },
  inputStats: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#2a5a2a',
    backgroundColor: '#0d1a0d',
  },
  statsText: {
    fontSize: 10,
    color: '#3a7a3a',
    letterSpacing: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 4,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#4ade80',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#0a0f0a',
    letterSpacing: 1,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 1,
  },
  historyBox: {
    padding: 12,
    backgroundColor: '#1a2a1a',
    borderWidth: 1,
    borderColor: '#2a5a2a',
    borderRadius: 4,
  },
  historyTitle: {
    fontSize: 11,
    fontWeight: 'bold' as const,
    color: '#4ade80',
    letterSpacing: 1,
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  historyText: {
    fontSize: 11,
    color: '#3a7a3a',
  },
  historyDate: {
    fontSize: 11,
    color: '#2a5a2a',
  },
});