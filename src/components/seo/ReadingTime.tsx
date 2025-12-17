import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';

interface ReadingTimeProps {
  content: string | React.ReactNode;
  wordsPerMinute?: number;
  className?: string;
}

/**
 * Calculate reading time based on content
 * Average reading speed: 200-250 words per minute
 */
export const ReadingTime: React.FC<ReadingTimeProps> = ({ 
  content, 
  wordsPerMinute = 200,
  className = ''
}) => {
  const readingTime = useMemo(() => {
    let text = '';
    
    if (typeof content === 'string') {
      text = content;
    } else if (React.isValidElement(content)) {
      // Extract text from React element (basic implementation)
      text = extractTextFromNode(content);
    }
    
    // Count words (simple word count)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    
    return minutes;
  }, [content, wordsPerMinute]);

  if (readingTime === 0) return null;

  return (
    <div className={`flex items-center gap-2 text-sm text-slate-600 ${className}`}>
      <Clock className="w-4 h-4" />
      <span>
        {readingTime} {readingTime === 1 ? 'minute' : 'minutes'} read
      </span>
    </div>
  );
};

// Helper to extract text from React node (simplified)
function extractTextFromNode(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  
  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join(' ');
  }
  
  if (React.isValidElement(node)) {
    if (node.props.children) {
      return extractTextFromNode(node.props.children);
    }
  }
  
  return '';
}

