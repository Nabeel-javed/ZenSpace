import { lazy, Suspense } from 'react';
import type { FC } from 'react';

const ReactMarkdown = lazy(() => import('react-markdown'));

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-stone prose-headings:font-serif prose-headings:font-semibold prose-p:text-stone-700 prose-li:text-stone-700 prose-strong:text-teal-800 ${className}`}>
      <Suspense fallback={<div className="animate-pulse text-stone-400">Loading...</div>}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </Suspense>
    </div>
  );
};
