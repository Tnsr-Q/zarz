export interface Exchange {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ParsedConversation {
  id: string;
  exchanges: Exchange[];
  metadata: {
    source?: string;
    model?: string;
    totalTokens?: number;
  };
  extractedFacts: string[];
  extractedInstructions: string[];
  themes: string[];
  timestamp: string;
}

export interface KnowledgeFile {
  format: 'markdown' | 'json' | 'text';
  content: string;
  metadata: {
    version: string;
    created: string;
    conversationCount: number;
    totalExchanges: number;
  };
}