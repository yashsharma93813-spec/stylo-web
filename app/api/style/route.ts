// =========================================================================
// 1. IMPORTS & INITIALIZATION
// Google Gen AI SDK aur Next.js response helper
// =========================================================================
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY missing in .env.local" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const occasion = (formData.get("occasion") as string) || "Casual";
    const language = (formData.get("language") as string) || "Hinglish";
    
    // Live Weather Context
    const weather = (formData.get("weather") as string) || "Clear 28°C";
    
    // Style DNA parameters
    const skinTone = (formData.get("skinTone") as string) || "Warm Olive / Wheatish";
    const height = (formData.get("height") as string) || "Average (5'7 - 5'11)";
    const bodyBuild = (formData.get("bodyBuild") as string) || "Athletic / Medium";
    const preferredStyle = (formData.get("preferredStyle") as string) || "Clean Minimalist";

    if (!file) {
      return NextResponse.json({ error: "Please upload an image" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString("base64");

    // Language guidelines
    let langInstruction = "Write styling tips in trendy Hinglish (Hindi + English mix).";
    if (language === "Hindi") {
      langInstruction = "Write styling tips and notes in stylish conversational Hindi.";
    } else if (language === "English") {
      langInstruction = "Write styling tips and notes in polished modern fashion English.";
    }

    // Weather & DNA combined system prompt
    const prompt = `You are Stylo, an elite AI fashion stylist.
Analyze the photo with user Style DNA and real-time environmental context:
- Occasion: "${occasion}"
- Live Weather: "${weather}" (Adapt fabric layering, breathable cotton/linen for hot weather, jackets/wool for cold weather)
- Skin Undertone: "${skinTone}"
- Height: "${height}"
- Body Build: "${bodyBuild}"
- Aesthetic: "${preferredStyle}"
- Selected Language: "${language}"

Language Rule: ${langInstruction}

Generate exactly 2 distinct recommendations:
1. Option 1: Classic & Weather-Comfortable Fit
2. Option 2: Bold & Modern Trend

Return strictly valid JSON:
{
  "options": [
    {
      "fitScore": 8.5,
      "vibe": "Outfit Vibe Name",
      "top": "Detailed topwear recommendation considering weather",
      "bottom": "Detailed bottomwear recommendation",
      "footwear": "Detailed shoes recommendation",
      "palette": ["#111111", "#333333", "#E5E5E5"],
      "stylingTip": "Actionable styling tip matching the selected language (${language}) referencing weather comfort and DNA."
    },
    {
      "fitScore": 9.0,
      "vibe": "Outfit Vibe Name",
      "top": "Detailed topwear recommendation considering weather",
      "bottom": "Detailed bottomwear recommendation",
      "footwear": "Detailed shoes recommendation",
      "palette": ["#222222", "#555555", "#FFFFFF"],
      "stylingTip": "Bold actionable tip matching the selected language (${language})."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: file.type || "image/jpeg",
                data: base64Data,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    let rawText = response.text || "{}";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(rawText);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("AI Styling Error:", error);
    return NextResponse.json({ error: error.message || "Styling failed" }, { status: 500 });
  }
}