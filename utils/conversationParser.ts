import { ParsedConversation, Exchange } from '@/types/conversation';

export async function parseConversation(text: string): Promise<ParsedConversation> {
  const lines = text.split('\n').filter(line => line.trim());
  const exchanges: Exchange[] = [];
  
  let currentRole: 'user' | 'assistant' | 'system' = 'user';
  let currentContent = '';
  
  // Simple pattern matching for common conversation formats
  for (const line of lines) {
    // Check for role indicators
    if (line.toLowerCase().startsWith('user:') || 
        line.toLowerCase().startsWith('human:') ||
        line.toLowerCase().startsWith('you:')) {
      if (currentContent) {
        exchanges.push({
          role: currentRole,
          content: currentContent.trim(),
        });
      }
      currentRole = 'user';
      currentContent = line.replace(/^(user:|human:|you:)/i, '').trim();
    } else if (line.toLowerCase().startsWith('assistant:') || 
               line.toLowerCase().startsWith('ai:') ||
               line.toLowerCase().startsWith('claude:') ||
               line.toLowerCase().startsWith('chatgpt:')) {
      if (currentContent) {
        exchanges.push({
          role: currentRole,
          content: currentContent.trim(),
        });
      }
      currentRole = 'assistant';
      currentContent = line.replace(/^(assistant:|ai:|claude:|chatgpt:)/i, '').trim();
    } else if (line.toLowerCase().startsWith('system:')) {
      if (currentContent) {
        exchanges.push({
          role: currentRole,
          content: currentContent.trim(),
        });
      }
      currentRole = 'system';
      currentContent = line.replace(/^system:/i, '').trim();
    } else {
      // Continue building current content
      currentContent += ' ' + line;
    }
  }
  
  // Add the last exchange
  if (currentContent) {
    exchanges.push({
      role: currentRole,
      content: currentContent.trim(),
    });
  }
  
  // If no clear role markers found, try to split by alternating pattern
  if (exchanges.length === 0) {
    const paragraphs = text.split(/\n\n+/);
    paragraphs.forEach((para, index) => {
      if (para.trim()) {
        exchanges.push({
          role: index % 2 === 0 ? 'user' : 'assistant',
          content: para.trim(),
        });
      }
    });
  }
  
  // Extract key information
  const extractedFacts = extractFacts(exchanges);
  const extractedInstructions = extractInstructions(exchanges);
  const themes = extractThemes(exchanges);
  
  return {
    id: generateId(),
    exchanges,
    metadata: {
      source: 'manual_import',
      totalTokens: text.length / 4, // Rough estimate
    },
    extractedFacts,
    extractedInstructions,
    themes,
    timestamp: new Date().toISOString(),
  };
}

function extractFacts(exchanges: Exchange[]): string[] {
  const facts: string[] = [];
  const factPatterns = [
    /(?:is|are|was|were|has|have|had)\s+[\w\s]+/gi,
    /\d+\s+(?:percent|%|years|months|days)/gi,
    /(?:called|named|known as)\s+[\w\s]+/gi,
  ];
  
  exchanges.forEach(exchange => {
    if (exchange.role === 'assistant') {
      factPatterns.forEach(pattern => {
        const matches = exchange.content.match(pattern);
        if (matches) {
          facts.push(...matches.slice(0, 3)); // Limit to avoid too many
        }
      });
    }
  });
  
  return [...new Set(facts)].slice(0, 10); // Deduplicate and limit
}

function extractInstructions(exchanges: Exchange[]): string[] {
  const instructions: string[] = [];
  const instructionPatterns = [
    /(?:you should|you can|you must|please|try to|make sure)\s+[\w\s]+/gi,
    /(?:step \d+:|first,|then,|finally,|next,)\s+[\w\s]+/gi,
    /(?:to\s+[\w]+,?\s+you)/gi,
  ];
  
  exchanges.forEach(exchange => {
    instructionPatterns.forEach(pattern => {
      const matches = exchange.content.match(pattern);
      if (matches) {
        instructions.push(...matches.slice(0, 3));
      }
    });
  });
  
  return [...new Set(instructions)].slice(0, 10);
}

function extractThemes(exchanges: Exchange[]): string[] {
  // Simple keyword-based theme extraction
  const allText = exchanges.map(e => e.content).join(' ').toLowerCase();
  const themes: string[] = [];
  
  const themeKeywords = {
    'Technology': ['software', 'computer', 'app', 'code', 'programming', 'ai', 'machine learning'],
    'Business': ['company', 'business', 'market', 'customer', 'product', 'service'],
    'Education': ['learn', 'teach', 'student', 'course', 'education', 'training'],
    'Health': ['health', 'medical', 'doctor', 'patient', 'treatment', 'disease'],
    'Science': ['research', 'study', 'experiment', 'data', 'analysis', 'theory'],
  };
  
  Object.entries(themeKeywords).forEach(([theme, keywords]) => {
    const count = keywords.filter(keyword => allText.includes(keyword)).length;
    if (count >= 2) {
      themes.push(theme);
    }
  });
  
  return themes.length > 0 ? themes : ['General'];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}