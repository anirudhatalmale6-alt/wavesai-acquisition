import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { chatCompletion } from "@/lib/openai";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = req.nextUrl.searchParams.get("type") || "status";

  if (type === "status") {
    const config = await prisma.seoEmbedConfig.findUnique({
      where: { tenantId: session.tenantId },
    });
    const articleCount = config
      ? await prisma.seoEmbedArticle.count({
          where: { tenantId: session.tenantId },
        })
      : 0;
    return NextResponse.json({
      connected: !!config,
      config: config
        ? { siteUrl: config.siteUrl, username: config.username, brandVoice: config.brandVoice }
        : null,
      articleCount,
    });
  }

  if (type === "history") {
    const articles = await prisma.seoEmbedArticle.findMany({
      where: { tenantId: session.tenantId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ articles });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { action } = body;

  if (action === "connect") {
    const { siteUrl, username, appPassword, brandVoice } = body;
    if (!siteUrl || !username || !appPassword)
      return NextResponse.json({ error: "Site URL, username, and app password are required." }, { status: 400 });

    const cleanUrl = siteUrl.replace(/\/+$/, "");

    try {
      const testRes = await fetch(`${cleanUrl}/wp-json/wp/v2/posts?per_page=1`, {
        headers: {
          Authorization: "Basic " + btoa(`${username}:${appPassword}`),
        },
      });
      if (!testRes.ok) {
        const errText = await testRes.text();
        return NextResponse.json(
          { error: `Could not connect to WordPress. Status ${testRes.status}. Make sure the URL, username, and application password are correct.` },
          { status: 400 }
        );
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      return NextResponse.json({ error: `Connection failed: ${msg}` }, { status: 400 });
    }

    await prisma.seoEmbedConfig.upsert({
      where: { tenantId: session.tenantId },
      update: { siteUrl: cleanUrl, username, appPassword, brandVoice: brandVoice || null },
      create: { tenantId: session.tenantId, siteUrl: cleanUrl, username, appPassword, brandVoice: brandVoice || null },
    });

    return NextResponse.json({ success: true, message: "WordPress site connected successfully." });
  }

  if (action === "disconnect") {
    await prisma.seoEmbedConfig.deleteMany({ where: { tenantId: session.tenantId } });
    return NextResponse.json({ success: true });
  }

  if (action === "generate") {
    const { keyword, businessType } = body;
    if (!keyword)
      return NextResponse.json({ error: "Keyword is required." }, { status: 400 });

    const config = await prisma.seoEmbedConfig.findUnique({
      where: { tenantId: session.tenantId },
    });
    if (!config)
      return NextResponse.json({ error: "No WordPress site connected. Please connect your site first." }, { status: 400 });

    const brandInstruction = config.brandVoice
      ? `Match this brand voice: ${config.brandVoice}.`
      : "Use a professional, authoritative tone.";

    const raw = await chatCompletion([
      {
        role: "system",
        content: `You are an expert SEO content writer who creates articles optimised for both Google and AI search engines (ChatGPT, Perplexity). ${brandInstruction} Return valid JSON only.`,
      },
      {
        role: "user",
        content: `Write an SEO-optimised blog article about "${keyword}"${businessType ? ` for a ${businessType} business` : ""}.

Requirements:
1. Engaging H1 title with keyword
2. Meta description (155 chars max)
3. Full article with H2/H3 subheadings in HTML
4. 800-1200 words, naturally incorporate keyword
5. End with a call to action
6. Optimise for Featured Snippets and AI citations

Return JSON: {"title":"...","metaDescription":"...","content":"<article HTML>"}`,
      },
    ]);

    let parsed: { title: string; metaDescription: string; content: string };
    try {
      const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to generate article. Please try again." }, { status: 500 });
    }

    const wordCount = parsed.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;

    let publishedUrl: string | null = null;
    let wpPostId: number | null = null;

    try {
      const wpRes = await fetch(`${config.siteUrl}/wp-json/wp/v2/posts`, {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${config.username}:${config.appPassword}`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: parsed.title,
          content: parsed.content,
          status: "publish",
          meta: { _yoast_wpseo_metadesc: parsed.metaDescription },
        }),
      });

      if (wpRes.ok) {
        const wpData = await wpRes.json();
        publishedUrl = wpData.link || null;
        wpPostId = wpData.id || null;
      }
    } catch {
      // Publishing failed but article was generated - save anyway
    }

    const article = await prisma.seoEmbedArticle.create({
      data: {
        tenantId: session.tenantId,
        title: parsed.title,
        keyword,
        content: parsed.content,
        metaDescription: parsed.metaDescription,
        publishedUrl,
        wpPostId,
        wordCount,
        status: publishedUrl ? "published" : "draft",
      },
    });

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        title: article.title,
        keyword: article.keyword,
        wordCount: article.wordCount,
        publishedUrl: article.publishedUrl,
        status: article.status,
      },
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
