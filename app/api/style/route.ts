import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const occasion = (formData.get("occasion") as string) || "Casual";
    const weather = (formData.get("weather") as string) || "Clear 28°C";
    const language = (formData.get("language") as string) || "English";
    const gender = (formData.get("gender") as string) || "Auto-detect";
    const skinTone = (formData.get("skinTone") as string) || "Warm Olive / Wheatish";
    const height = (formData.get("height") as string) || "Average";
    const bodyBuild = (formData.get("bodyBuild") as string) || "Medium";
    const preferredStyle = (formData.get("preferredStyle") as string) || "Clean Minimalist";

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    const systemPrompt = `
You are a world-class, honest, highly observant Haute Couture & Streetwear Stylist and Wardrobe Critic.

USER CONTEXT:
- Target Gender Preference: ${gender} (If "Auto-detect", carefully inspect the photo to determine if the subject is female/male and suggest ONLY gender-appropriate cuts, silhouettes, and garments).
- Occasion: ${occasion}
- Weather / Ambient Temp: ${weather}
- Skin Undertone: ${skinTone}
- Height / Build: ${height}, ${bodyBuild}
- Target Aesthetic: ${preferredStyle}
- Language: ${language} (If Hindi, provide all styling tips and critique in clean, natural Hindi).

STRICT CRITICAL RULES:
1. GENDER ACCURACY: If the image is a female or gender is Women, recommend women's attire (e.g., tailored blouses, flowy trousers, chic dresses, co-ords, skirts, kurtas, heels/sneakers). NEVER recommend men's menswear to women.
2. NO COLOR REPETITION (AVOID OLIVE GREEN DEFAULT): Do NOT default to olive green, sage, or earthy beige repeatedly. Intentionally explore diverse, high-appeal color combinations tailored to the skin undertone (e.g., Cobalt Blue, Terracotta, Burgundy, Charcoal, Lavender, Crisp Whites, Mustard, Emerald, Dusty Rose, Mocha, Pastels, or Classic Monochromes).
3. HONEST SCAN & CRITIQUE FIRST:
   - First, inspect what the user is currently wearing in the uploaded image.
   - Give an honest critique of their current outfit: what works, what lacks (fit, color clash, or silhouette imbalance), and give their CURRENT outfit a realistic score out of 10.
4. TWO UPGRADED FIT RECOMMENDATIONS:
   - Option 1 (Polished / Classic Upgrade): A clean, wearable improvement that builds upon or elevates their current style for the occasion.
   - Option 2 (Statement / Bold Alternative): A daring, trend-forward, high-contrast aesthetic fit.

OUTPUT FORMAT:
Return strictly a raw JSON object (without markdown code fences, no \`\`\`json) with this exact schema:

{
  "currentScan": {
    "detectedItems": "Short summary of what they are wearing in the photo",
    "critique": "Honest breakdown of their current outfit, fit, color harmony, and what to improve",
    "currentScore": 7
  },
  "options": [
    {
      "vibe": "E.g. Sartorial Minimalist / Chic Casual",
      "fitScore": 9.2,
      "top": "Exact topwear description with precise color, texture, cut",
      "bottom": "Exact bottomwear with fit and complementary color",
      "footwear": "Matching shoes/footwear",
      "palette": ["#Hex1", "#Hex2", "#Hex3"],
      "stylingTip": "Actionable, honest pro-tip on tucking, accessories, proportions, and layering for the current weather."
    },
    {
      "vibe": "E.g. Bold Contrast / Contemporary Edge",
      "fitScore": 9.6,
      "top": "Distinct topwear with vibrant/rich colors",
      "bottom": "Complementary bottomwear",
      "footwear": "Matching statement footwear",
      "palette": ["#Hex1", "#Hex2", "#Hex3"],
      "stylingTip": "Elevated styling note focusing on jewelry/watches, scent, and silhouette balance."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: image.type || "image/jpeg",
              },
            },
            {
              text: systemPrompt,
            },
          ],
        },
      ],
    });

    let rawText = response.text || "";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsedData = JSON.parse(rawText);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Style API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate styling critique and recommendation" },
      { status: 500 }
    );
  }
}