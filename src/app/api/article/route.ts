import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  slug: z.string().min(1, "Slug is required"),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  author: z.object({
    name: z.string().min(1, "Author name is required"),
    avatar: z.string().url("Invalid URL"),
  }),
  date: z.string().min(1, "Date is required"),
  readTime: z.string().min(1, "Read time is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string().min(1, "Tag cannot be empty")),
  imageUrl: z.string().url("Invalid image URL"),
  imageAltText: z.string().optional(), // New field for image alt text
  status: z.enum(["draft", "publish", "scheduled"]).default("draft"),
  scheduledDate: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = articleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const supabase = createClient();

    if (body.status === "scheduled" && !body.scheduledDate) {
      return NextResponse.json(
        { error: "Schedule date is required for scheduled articles" },
        { status: 400 }
      );
    }

    const { data, error } = await (await supabase).from("articles").insert([
      {
        title: body.title,
        subtitle: body.subtitle,
        slug: body.slug,
        meta_description: body.metaDescription,
        keywords: body.keywords,
        author_name: body.author.name,
        author_avatar: body.author.avatar,
        date: body.date,
        read_time: body.readTime,
        category: body.category,
        content: body.content,
        tags: body.tags,
        image_url: body.imageUrl,
        image_alt_text: body.imageAltText, // Include new field
        status: body.status,
        scheduled_date: body.scheduledDate || null,
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Error inserting data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Data inserted successfully", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");

    const supabase = createClient();
    let query = (await supabase).from("articles").select("*");

    if (id) {
      const { data: article, error: articleError } = await query
        .eq("id", id)
        .single();

      if (articleError) {
        return new NextResponse(
          JSON.stringify({ error: "Article not found" }),
          { status: 404 }
        );
      }

      const { data: relatedArticles, error: relatedError } = await (
        await supabase
      )
        .from("articles")
        .select("*")
        .neq("id", id)
        .contains("tags", article.tags)
        .limit(3);

      if (relatedError) {
        return new NextResponse(
          JSON.stringify({ error: "Failed to fetch related articles" }),
          { status: 500 }
        );
      }

      return new NextResponse(
        JSON.stringify({ article, relatedArticles }),
        { status: 200 }
      );
    } else {
      if (status) {
        query = query.eq("status", status);
      }

      const currentDate = new Date().toISOString();
      if (status !== "scheduled") {
        await (await supabase)
          .from("articles")
          .update({ status: "publish" })
          .eq("status", "scheduled")
          .lt("scheduled_date", currentDate);
      }

      const { data: articles, error } = await query;

      if (error) {
        return new NextResponse(
          JSON.stringify({ error: "Failed to fetch articles" }),
          { status: 500 }
        );
      }

      return new NextResponse(JSON.stringify(articles), { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validation = articleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const supabase = createClient();

    if (body.status === "scheduled" && !body.scheduledDate) {
      return NextResponse.json(
        { error: "Schedule date is required for scheduled articles" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const { error } = await (await supabase)
      .from("articles")
      .update({
        title: body.title,
        subtitle: body.subtitle,
        slug: body.slug,
        meta_description: body.metaDescription,
        keywords: body.keywords,
        author_name: body.author.name,
        author_avatar: body.author.avatar,
        date: body.date,
        read_time: body.readTime,
        category: body.category,
        content: body.content,
        tags: body.tags,
        image_url: body.imageUrl,
        image_alt_text: body.imageAltText, // Include new field
        status: body.status,
        scheduled_date: body.scheduledDate || null,
      })
      .eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Error updating article" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Article updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Article ID is required" }),
        {
          status: 400,
        }
      );
    }

    const supabase = createClient();
    const { error } = await (await supabase).from("articles").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return new NextResponse(
        JSON.stringify({ error: "Error deleting article" }),
        {
          status: 500,
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Article deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    if (!body.status || !["draft", "publish", "scheduled"].includes(body.status)) {
      return NextResponse.json(
        { error: "Valid status is required" },
        { status: 400 }
      );
    }

    if (body.status === "scheduled" && !body.scheduledDate) {
      return NextResponse.json(
        { error: "Schedule date is required for scheduled articles" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const updateData: any = { status: body.status };

    if (body.scheduledDate) {
      updateData.scheduled_date = body.scheduledDate;
    }

    const { error } = await (await supabase)
      .from("articles")
      .update(updateData)
      .eq("id", body.id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Error updating article status" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Article status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}