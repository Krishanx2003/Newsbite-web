import { NextResponse } from 'next/server';
import { updateArticleSEO } from '@/lib/seo-utils';

export async function POST(request: Request) {
  try {
    const { articleId, title, content } = await request.json();

    if (!articleId || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const seoContent = await updateArticleSEO(articleId, title, content);

    if (!seoContent) {
      return NextResponse.json(
        { error: 'Failed to generate SEO content' },
        { status: 500 }
      );
    }

    return NextResponse.json(seoContent);
  } catch (error) {
    console.error('Error updating SEO:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 