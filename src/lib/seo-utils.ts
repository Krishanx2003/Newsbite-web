import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateSEOContentParams {
  title: string;
  content: string;
  type: 'description' | 'keywords';
}

export async function generateSEOContent({
  title,
  content,
  type,
}: GenerateSEOContentParams): Promise<string> {
  try {
    const prompt = type === 'description'
      ? `Generate a concise, engaging meta description (max 160 characters) for a news article titled "${title}". Content: ${content}`
      : `Generate 5-7 relevant keywords for a news article titled "${title}". Content: ${content}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: type === 'description'
            ? "You are an SEO expert. Generate concise, engaging meta descriptions that accurately represent the content while being optimized for search engines."
            : "You are an SEO expert. Generate relevant, targeted keywords that accurately represent the main topics and themes of the content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: type === 'description' ? 100 : 50,
    });

    return completion.choices[0].message.content?.trim() || '';
  } catch (error) {
    console.error('Error generating SEO content:', error);
    return '';
  }
}

export async function updateArticleSEO(articleId: string, title: string, content: string) {
  try {
    const [description, keywords] = await Promise.all([
      generateSEOContent({ title, content, type: 'description' }),
      generateSEOContent({ title, content, type: 'keywords' })
    ]);

    // Here you would typically update your database with the new SEO content
    // Example:
    // await prisma.article.update({
    //   where: { id: articleId },
    //   data: {
    //     metaDescription: description,
    //     metaKeywords: keywords,
    //     seoUpdatedAt: new Date()
    //   }
    // });

    return { description, keywords };
  } catch (error) {
    console.error('Error updating article SEO:', error);
    return null;
  }
} 