/**
 * AI Integration using Google Gemini (Free Tier)
 * 
 * Gemini 1.5 Flash Free Tier:
 * - 15 requests per minute
 * - 1,500 requests per day
 * - Perfect for young creators!
 * 
 * To enable: Set GEMINI_API_KEY environment variable
 * Get your free API key at: https://makersuite.google.com/app/apikey
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

export function isAIEnabled(): boolean {
  return genAI !== null;
}

/**
 * Generate a YouTube video description
 */
export async function generateDescription(videoTitle: string): Promise<string> {
  if (!genAI) {
    return getFallbackDescription(videoTitle);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are helping a young YouTube creator (age 8-12) write a video description.
    
Video Title: "${videoTitle}"

Write a fun, engaging YouTube video description that:
- Is appropriate for kids
- Has an exciting intro paragraph
- Includes 3-4 bullet points of what viewers will learn/see
- Has a friendly call-to-action to like and subscribe
- Includes 3-5 relevant hashtags at the end
- Is about 150-200 words total

Keep the tone fun and enthusiastic like a kid talking to their friends!`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return getFallbackDescription(videoTitle);
  }
}

/**
 * Generate YouTube tags
 */
export async function generateTags(videoTitle: string): Promise<string[]> {
  if (!genAI) {
    return getFallbackTags(videoTitle);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Generate 12 relevant YouTube tags for a video titled: "${videoTitle}"

Requirements:
- Tags should help the video get discovered
- Mix of broad and specific tags
- Include trending/popular tags when relevant
- Kid-friendly content only
- Return ONLY the tags, separated by commas, no numbering or extra text`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tagsText = response.text();
    
    // Parse tags - handle comma, semicolon, or newline separated formats
    return tagsText
      .split(/[,;\n]+/)
      .map(tag => tag.trim().toLowerCase().replace(/^#/, '').replace(/^\d+[\.\)]\s*/, ''))
      .filter(tag => tag.length > 0 && tag.length < 50);
  } catch (error) {
    console.error("Gemini API error:", error);
    return getFallbackTags(videoTitle);
  }
}

/**
 * Generate thumbnail ideas
 */
export async function generateThumbnailIdeas(videoTitle: string): Promise<string[]> {
  if (!genAI) {
    return getFallbackThumbnailIdeas();
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Suggest 6 specific thumbnail ideas for a YouTube video titled: "${videoTitle}"

For each idea, describe:
- The visual composition
- Text overlay suggestion
- Color scheme
- Expression/emotion to convey

Keep suggestions kid-friendly and attention-grabbing.
Format: Return each idea on a new line, numbered 1-6.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Parse numbered list
    return response.text()
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 6);
  } catch (error) {
    console.error("Gemini API error:", error);
    return getFallbackThumbnailIdeas();
  }
}

/**
 * Generate content ideas
 */
export async function generateContentIdeas(category?: string): Promise<string[]> {
  if (!genAI) {
    return getFallbackContentIdeas();
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const categoryContext = category ? `in the ${category} category` : "for a young YouTube creator";
    
    const prompt = `Generate 8 creative YouTube video ideas ${categoryContext}.

Requirements:
- Ideas should be fun and engaging for kids ages 8-12 to make
- Should be achievable without expensive equipment
- Mix of trending formats and evergreen content
- Include specific title suggestions

Format: Return each idea as a catchy video title, one per line.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text()
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').replace(/^[-•]\s*/, '').trim())
      .filter(line => line.length > 0 && line.length < 100)
      .slice(0, 8);
  } catch (error) {
    console.error("Gemini API error:", error);
    return getFallbackContentIdeas();
  }
}

// Fallback functions when API is not available
function getFallbackDescription(videoTitle: string): string {
  return `In this video, we dive deep into ${videoTitle}! You'll learn everything you need to know and more. Don't forget to like and subscribe for more awesome content!

⏱️ Timestamps:
0:00 - Intro
0:30 - Main Content
5:00 - Conclusion

💜 Follow me on social media for behind-the-scenes content!

#${videoTitle.replace(/\s/g, '')} #YouTube #Tutorial`;
}

function getFallbackTags(videoTitle: string): string[] {
  const baseTags = videoTitle.toLowerCase().split(' ').filter(w => w.length > 2);
  const currentYear = new Date().getFullYear().toString();
  const additionalTags = ['tutorial', 'howto', 'tips', 'guide', 'beginner', 'viral', 'trending', currentYear];
  return [...baseTags, ...additionalTags].slice(0, 15);
}

function getFallbackThumbnailIdeas(): string[] {
  return [
    "Bright yellow background with large bold text and your surprised face",
    "Before & After split screen with dramatic transformation",
    "Red circle and arrow pointing to the key element",
    "Minimalist design with emoji and big number",
    "Action shot with motion blur effect",
    "Close-up face with shocked expression and text overlay"
  ];
}

function getFallbackContentIdeas(): string[] {
  return [
    "Top 10 Things You Didn't Know About...",
    "I Tried [Challenge] for 24 Hours",
    "ULTIMATE Beginner's Guide to...",
    "5 Mistakes Everyone Makes (And How to Fix Them)",
    "Behind the Scenes of My Creative Process",
    "Reacting to Viewer Comments",
    "My Monthly Favorites and Recommendations",
    "Q&A: You Asked, I Answered!"
  ];
}
