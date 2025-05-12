// /admin/articles/articlesform/page.tsx
import { Suspense } from 'react';
import ArticleForm from '../components/form';

export default function ArticleFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleForm />
    </Suspense>
  );
}