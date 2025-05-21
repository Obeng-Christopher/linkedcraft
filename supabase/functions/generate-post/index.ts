
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface UserPreferences {
  writing_styles?: string[];
  industries?: string[];
  job_descriptions?: string[];
  content_categories?: string[];
  posting_goals?: string[];
  custom_cta?: string;
  fine_tuning_notes?: string;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, userPreferences } = await req.json();
    
    if (!topic) {
      return new Response(
        JSON.stringify({ error: "Topic is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const preferences = userPreferences as UserPreferences || {};
    
    // Create a prompt based on user preferences
    const writingStyle = preferences.writing_styles?.join(", ") || "professional";
    const industry = preferences.industries?.join(", ") || "general";
    const jobDescription = preferences.job_descriptions?.join(", ") || "";
    const contentCategory = preferences.content_categories?.join(", ") || "";
    const postingGoal = preferences.posting_goals?.join(", ") || "engagement";
    const customCta = preferences.custom_cta || "";
    const fineTuningNotes = preferences.fine_tuning_notes || "";

    const prompt = `
    Create a LinkedIn post about "${topic}". 
    
    Use these details to personalize the content:
    - Writing style: ${writingStyle}
    - Industry: ${industry}
    ${jobDescription ? `- Job role: ${jobDescription}` : ""}
    ${contentCategory ? `- Content category: ${contentCategory}` : ""}
    - Goal of the post: ${postingGoal}
    ${customCta ? `- Include this call-to-action: ${customCta}` : ""}
    ${fineTuningNotes ? `- Additional notes: ${fineTuningNotes}` : ""}
    
    The post should be concise (under 1,300 characters), engaging, and formatted appropriately for LinkedIn with line breaks and emojis where suitable. Include 3-5 relevant hashtags at the end.
    
    Return the post text only, without any explanations or additional formatting.
    `;

    // Make request to OpenAI
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional LinkedIn content creator who specializes in writing engaging posts that drive engagement and achieve business goals."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      }),
    });

    const openAIData = await openAIResponse.json();

    if (openAIResponse.status !== 200) {
      throw new Error(openAIData.error?.message || "Error generating content");
    }

    const generatedContent = openAIData.choices[0].message.content.trim();
    
    return new Response(
      JSON.stringify({ content: generatedContent }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
