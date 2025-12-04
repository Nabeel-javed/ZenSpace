import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-stone prose-headings:font-serif prose-headings:font-semibold prose-p:text-stone-700 prose-li:text-stone-700 prose-strong:text-teal-800 ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};
