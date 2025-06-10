import React from 'react';
import { cn } from '@/lib/utils';

interface ArticleContentProps {
  content: string;
  className?: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content, className }) => {
  return (
    <article
      className={cn(
        'prose prose-lg dark:prose-invert max-w-none',
        'prose-headings:font-bold prose-headings:tracking-tight',
        'prose-h1:text-4xl prose-h1:mb-8',
        'prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6',
        'prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4',
        'prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-4',
        'prose-h5:text-lg prose-h5:mt-6 prose-h5:mb-3',
        'prose-h6:text-base prose-h6:mt-4 prose-h6:mb-2',
        'prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6',
        'prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline',
        'prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-gray-100',
        'prose-em:text-gray-700 dark:prose-em:text-gray-300',
        'prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6',
        'prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6',
        'prose-li:text-lg prose-li:leading-relaxed prose-li:mb-2',
        'prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:my-8',
        'prose-code:text-base prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
        'prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto',
        'prose-img:rounded-lg prose-img:my-8 prose-img:shadow-md',
        'prose-table:w-full prose-table:my-8 prose-table:border-collapse',
        'prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3',
        'prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:p-3',
        'prose-hr:my-8 prose-hr:border-gray-200 dark:prose-hr:border-gray-700',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default ArticleContent; 