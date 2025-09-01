import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { ParsedConversation } from '@/types/conversation';

interface KnowledgeContextType {
  conversationHistory: ParsedConversation[];
  addConversation: (conversation: ParsedConversation) => void;
  clearHistory: () => void;
  isLoading: boolean;
}

export const [KnowledgeProvider, useKnowledge] = createContextHook<KnowledgeContextType>(() => {
  const [conversationHistory, setConversationHistory] = useState<ParsedConversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const mountedRef = useRef<boolean>(false);

  useEffect(() => {
    mountedRef.current = true;
    loadHistory();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('conversation_history');
      if (stored && mountedRef.current) {
        setConversationHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const saveHistory = async (history: ParsedConversation[]) => {
    try {
      await AsyncStorage.setItem('conversation_history', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  const addConversation = (conversation: ParsedConversation) => {
    const updated = [...conversationHistory, conversation];
    setConversationHistory(updated);
    void saveHistory(updated);
  };

  const clearHistory = () => {
    setConversationHistory([]);
    void AsyncStorage.removeItem('conversation_history');
  };

  return {
    conversationHistory,
    addConversation,
    clearHistory,
    isLoading,
  };
});