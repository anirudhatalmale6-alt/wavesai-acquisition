const OPENAI_KEY = process.env.OPENAI_API_KEY!;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatCompletion(
  messages: ChatMessage[],
  model = "gpt-4o-mini",
  temperature = 0.7
) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({ model, messages, temperature }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function generateSeoContent(
  keyword: string,
  businessType: string,
  tone = "professional"
) {
  return chatCompletion([
    {
      role: "system",
      content: `You are an expert SEO content writer. Write in a ${tone} tone. Create content that is optimized for search engines while being engaging and valuable for readers.`,
    },
    {
      role: "user",
      content: `Write a comprehensive, SEO-optimized blog article about "${keyword}" for a ${businessType} business. Include:
1. An engaging H1 title (include the keyword naturally)
2. A compelling meta description (155 characters max)
3. The full article with H2/H3 subheadings
4. Naturally incorporate the keyword and related terms
5. Aim for 800-1200 words
6. End with a call to action

Format the response as JSON with fields: title, metaDescription, content (the full article in HTML)`,
    },
  ]);
}

export async function generateAdCopy(
  platform: string,
  businessType: string,
  targetAudience: string,
  objective = "conversions"
) {
  return chatCompletion([
    {
      role: "system",
      content:
        "You are an expert digital advertising copywriter who creates high-converting ad copy.",
    },
    {
      role: "user",
      content: `Create 3 ad copy variations for ${platform} ads. Business type: ${businessType}. Target audience: ${targetAudience}. Objective: ${objective}.

For each variation provide:
- headline (max 30 chars for Google, 40 for Facebook)
- description (max 90 chars for Google, 125 for Facebook)
- call_to_action

Format as JSON array with fields: headline, description, callToAction`,
    },
  ]);
}
