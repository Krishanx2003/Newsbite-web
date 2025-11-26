import { createClient } from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  subtitle: z.string().min(1, 'Subtitle is required').trim(),
  slug: z.string().min(1, 'Slug is required').trim(),
  meta_description: z.string().optional(),
  keywords: z.string().optional(),
  author_name: z.string().min(1, 'Author name is required').trim(),
  author_avatar: z.string().url('Invalid avatar URL').default('https://example.com/default-avatar.jpg'),
  date: z.string().min(1, 'Date is required'),
  read_time: z.string().min(1, 'Read time is required'),
  category: z.string().min(1, 'Category is required').trim(),
  content: z.string().min(1, 'Content is required').trim(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).min(1, 'At least one tag is required'),
  image_url: z.string().url('Invalid image URL').optional(),
  image_alt_text: z.string().optional(),
  status: z.enum(['draft', 'publish', 'scheduled']).default('draft'),
  scheduled_date: z.string().optional(),
});

const patchSchema = z.object({
  id: z.string().uuid('Invalid article ID'),
  status: z.enum(['draft', 'publish', 'scheduled']),
  scheduled_date: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const category = searchParams.get('category');

    // Check if user is authenticated and admin
    let isAdmin = false;
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!userError && user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (!profileError && profile?.role === 'admin') {
        isAdmin = true;
      }
    }

    // Update scheduled articles to publish if past due
    const currentDate = new Date().toISOString();
    await supabase
      .from('articles')
      .update({ status: 'publish' })
      .eq('status', 'scheduled')
      .lte('scheduled_date', currentDate);

    if (id || slug) {
      // Fetch single article
      let query = supabase.from('articles').select('*');
      if (id) {
        query = query.eq('id', id);
      } else if (slug) {
        query = query.eq('slug', slug);
      }
      if (!isAdmin) {
        query = query.eq('status', 'publish');
      }
      const { data: article, error: articleError } = await query.single();

      if (articleError || !article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }

      // Fetch related articles based on tags
      const { data: relatedArticles, error: relatedError } = await supabase
        .from('articles')
        .select('id, title, slug, image_url, category, tags')
        .neq('id', article.id)
        .contains('tags', article.tags)
        .eq('status', 'publish')
        .order('created_at', { ascending: false })
        .limit(3);

      if (relatedError) {
        console.error('Related articles error:', relatedError);
      }

      return NextResponse.json(
        { article, relatedArticles: relatedArticles || [] },
        { status: 200 }
      );
    }

    // Fetch all articles
    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status && isAdmin) {
      query = query.eq('status', status);
    } else if (!isAdmin) {
      query = query.eq('status', 'publish');
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data: articles, error, count } = await query;

    if (error) {
      console.error('Fetch articles error:', error);
      return NextResponse.json({ error: 'Failed to fetch articles', details: error }, { status: 500 });
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json(
      { articles: articles || [], totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET articles error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const validation = articleSchema.safeParse({
      ...body,
      author_name: body.author?.name ?? 'Unknown',
      author_avatar: body.author?.avatar ?? 'https://example.com/default-avatar.jpg',
    });

    if (!validation.success) {
      console.error('Validation errors:', validation.error.errors);
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;
    if (data.status === 'scheduled' && !data.scheduled_date) {
      return NextResponse.json(
        { error: 'Scheduled date is required for scheduled articles' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const { data: existingArticle, error: slugError } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', data.slug)
      .single();

    if (existingArticle) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    if (slugError && slugError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Error checking slug' }, { status: 500 });
    }

    const { data: inserted, error } = await supabase
      .from('articles')
      .insert({
        title: data.title,
        subtitle: data.subtitle,
        slug: data.slug,
        meta_description: data.meta_description,
        keywords: data.keywords,
        author_name: data.author_name,
        author_avatar: data.author_avatar,
        date: data.date,
        read_time: data.read_time,
        category: data.category,
        content: data.content,
        tags: data.tags,
        image_url: data.image_url,
        image_alt_text: data.image_alt_text,
        status: data.status,
        scheduled_date: data.status === 'scheduled' ? data.scheduled_date : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Error creating article' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Article created successfully', article: inserted },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST articles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || !z.string().uuid().safeParse(id).success) {
      return NextResponse.json({ error: 'Valid article ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const validation = articleSchema.safeParse({
      ...body,
      author_name: body.author?.name ?? 'Unknown',
      author_avatar: body.author?.avatar ?? 'https://example.com/default-avatar.jpg',
    });

    if (!validation.success) {
      console.error('Validation errors:', validation.error.errors);
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;
    if (data.status === 'scheduled' && !data.scheduled_date) {
      return NextResponse.json(
        { error: 'Scheduled date is required for scheduled articles' },
        { status: 400 }
      );
    }

    // Check for duplicate slug (excluding current article)
    const { data: existingArticle, error: slugError } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', data.slug)
      .neq('id', id)
      .single();

    if (existingArticle) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    if (slugError && slugError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Error checking slug' }, { status: 500 });
    }

    const { data: updated, error } = await supabase
      .from('articles')
      .update({
        title: data.title,
        subtitle: data.subtitle,
        slug: data.slug,
        meta_description: data.meta_description,
        keywords: data.keywords,
        author_name: data.author_name,
        author_avatar: data.author_avatar,
        date: data.date,
        read_time: data.read_time,
        category: data.category,
        content: data.content,
        tags: data.tags,
        image_url: data.image_url,
        image_alt_text: data.image_alt_text,
        status: data.status,
        scheduled_date: data.status === 'scheduled' ? data.scheduled_date : null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Error updating article' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Article updated successfully', article: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT articles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const validation = patchSchema.safeParse(body);

    if (!validation.success) {
      console.error('Validation errors:', validation.error.errors);
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { id, status, scheduled_date } = validation.data;
    if (status === 'scheduled' && !scheduled_date) {
      return NextResponse.json(
        { error: 'Scheduled date is required for scheduled articles' },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    if (status === 'scheduled' && scheduled_date) {
      updateData.scheduled_date = scheduled_date;
    } else {
      updateData.scheduled_date = null;
    }

    const { data: updated, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      console.error('Supabase patch error:', error);
      return NextResponse.json({ error: 'Error updating article status' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Article status updated successfully', article: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH articles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || !z.string().uuid().safeParse(id).success) {
      return NextResponse.json({ error: 'Valid article ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: 'Error deleting article' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Article deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE articles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}