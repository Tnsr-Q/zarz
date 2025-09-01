import { ParsedConversation, KnowledgeFile } from '@/types/conversation';

export function generateKnowledgeFile(
  conversations: ParsedConversation[],
  format: 'markdown' | 'json' | 'text' = 'markdown'
): string {
  switch (format) {
    case 'markdown':
      return generateMarkdown(conversations);
    case 'json':
      return generateJSON(conversations);
    case 'text':
      return generatePlainText(conversations);
    default:
      return generateMarkdown(conversations);
  }
}

function generateMarkdown(conversations: ParsedConversation[]): string {
  let content = '# Knowledge Base\n\n';
  content += `Generated on ${new Date().toLocaleDateString()}\n\n`;
  content += `## Summary\n\n`;
  content += `- Total Conversations: ${conversations.length}\n`;
  content += `- Total Exchanges: ${conversations.reduce((sum, c) => sum + c.exchanges.length, 0)}\n\n`;
  
  // Extract all unique facts and instructions
  const allFacts = new Set<string>();
  const allInstructions = new Set<string>();
  const allThemes = new Set<string>();
  
  conversations.forEach(conv => {
    conv.extractedFacts.forEach(fact => allFacts.add(fact));
    conv.extractedInstructions.forEach(inst => allInstructions.add(inst));
    conv.themes.forEach(theme => allThemes.add(theme));
  });
  
  // Key Facts Section
  if (allFacts.size > 0) {
    content += '## Key Facts\n\n';
    Array.from(allFacts).forEach(fact => {
      content += `- ${fact}\n`;
    });
    content += '\n';
  }
  
  // Instructions Section
  if (allInstructions.size > 0) {
    content += '## Instructions & Guidelines\n\n';
    Array.from(allInstructions).forEach(instruction => {
      content += `- ${instruction}\n`;
    });
    content += '\n';
  }
  
  // Themes Section
  if (allThemes.size > 0) {
    content += '## Topics Covered\n\n';
    Array.from(allThemes).forEach(theme => {
      content += `- ${theme}\n`;
    });
    content += '\n';
  }
  
  // Q&A Section
  content += '## Questions & Answers\n\n';
  conversations.forEach((conv, convIndex) => {
    content += `### Conversation ${convIndex + 1}\n\n`;
    
    conv.exchanges.forEach((exchange, index) => {
      if (exchange.role === 'user') {
        content += `**Q${Math.floor(index / 2) + 1}:** ${exchange.content}\n\n`;
      } else if (exchange.role === 'assistant') {
        content += `**A:** ${exchange.content}\n\n`;
      }
    });
  });
  
  return content;
}

function generateJSON(conversations: ParsedConversation[]): string {
  const knowledgeBase = {
    metadata: {
      version: '1.0.0',
      generated: new Date().toISOString(),
      conversationCount: conversations.length,
      totalExchanges: conversations.reduce((sum, c) => sum + c.exchanges.length, 0),
    },
    facts: Array.from(new Set(conversations.flatMap(c => c.extractedFacts))),
    instructions: Array.from(new Set(conversations.flatMap(c => c.extractedInstructions))),
    themes: Array.from(new Set(conversations.flatMap(c => c.themes))),
    conversations: conversations.map((conv, index) => ({
      id: conv.id,
      index: index + 1,
      timestamp: conv.timestamp,
      exchanges: conv.exchanges.map(exchange => ({
        role: exchange.role,
        content: exchange.content,
      })),
      metadata: conv.metadata,
    })),
  };
  
  return JSON.stringify(knowledgeBase, null, 2);
}

function generatePlainText(conversations: ParsedConversation[]): string {
  let content = 'KNOWLEDGE BASE\n';
  content += '=' .repeat(50) + '\n\n';
  content += `Generated: ${new Date().toLocaleDateString()}\n`;
  content += `Conversations: ${conversations.length}\n\n`;
  
  conversations.forEach((conv, convIndex) => {
    content += '-'.repeat(50) + '\n';
    content += `CONVERSATION ${convIndex + 1}\n`;
    content += '-'.repeat(50) + '\n\n';
    
    conv.exchanges.forEach(exchange => {
      const roleLabel = exchange.role.toUpperCase();
      content += `[${roleLabel}]\n${exchange.content}\n\n`;
    });
  });
  
  return content;
}

export function mergeKnowledgeFiles(files: string[], maxSize: number = 100000): string[] {
  const merged: string[] = [];
  let current = '';
  
  files.forEach(file => {
    if (current.length + file.length > maxSize) {
      merged.push(current);
      current = file;
    } else {
      current += '\n\n---\n\n' + file;
    }
  });
  
  if (current) {
    merged.push(current);
  }
  
  return merged;
}