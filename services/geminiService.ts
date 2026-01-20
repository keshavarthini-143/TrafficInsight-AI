// geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { CongestionLevel, TrafficAnalysis, GroundingChunk } from "../types";

// ✅ Use Vite env variable for API key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey });

/**
 * Analyze traffic for a given location using Gemini API
 * @param location - Location string, e.g., "Bengaluru, India"
 * @returns analysis + grounding info
 */
export async function analyzeTraffic(
  location: string
): Promise<{ analysis: TrafficAnalysis; grounding: GroundingChunk[] }> {
  // ✅ Return mock data if API key missing
  if (!apiKey) {
    console.warn("API key missing, returning mock traffic data.");

    const mockAnalysis: TrafficAnalysis = {
      location,
      lat: 0,
      lng: 0,
      congestionLevel: "Low",
      roadColor: "green",
      confidence: "High",
      message: "Smooth Traffic",
      explanation: "Mock data because API key is missing"
    };

    return { analysis: mockAnalysis, grounding: [] };
  }

  try {
    // 1️⃣ Traffic Analysis (Structured JSON)
    const analysisResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a smart traffic congestion analysis system.
Input Location: "${location}"
Current Date/Time: ${new Date().toLocaleString()}

Task:
1. Determine the approximate center latitude and longitude for "${location}".
2. Determine the current traffic congestion level based on typical patterns for this area and time.
3. Classify as: Low, Medium, or High.
Rules:
- High: roadColor red, message "High Congestion"
- Medium: roadColor orange, message "Moderate Traffic"
- Low: roadColor green, message "Smooth Traffic"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            location: { type: Type.STRING },
            lat: { type: Type.NUMBER, description: "Latitude of the location" },
            lng: { type: Type.NUMBER, description: "Longitude of the location" },
            congestionLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            roadColor: { type: Type.STRING, enum: ['green', 'orange', 'red'] },
            confidence: { type: Type.STRING },
            message: { type: Type.STRING },
            explanation: { type: Type.STRING, description: "Detailed reasoning considering time and patterns." }
          },
          required: [
            "location",
            "lat",
            "lng",
            "congestionLevel",
            "roadColor",
            "confidence",
            "message",
            "explanation"
          ]
        }
      }
    });

    const analysis: TrafficAnalysis = JSON.parse(analysisResponse.text);

    // 2️⃣ Grounding info (Google Maps + traffic context)
    const groundingResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Show the location of ${location} on Google Maps and highlight traffic-heavy intersections or major routes nearby.`,
      config: {
        tools: [{ googleMaps: {} }]
      }
    });

    const grounding: GroundingChunk[] =
      groundingResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { analysis, grounding };
  } catch (error) {
    console.error("Gemini API error:", error);

    // Return fallback data on error
    const fallbackAnalysis: TrafficAnalysis = {
      location,
      lat: 0,
      lng: 0,
      congestionLevel: "Medium",
      roadColor: "orange",
      confidence: "Medium",
      message: "Could not fetch real traffic data",
      explanation: `Error: ${error instanceof Error ? error.message : error}`
    };

    return { analysis: fallbackAnalysis, grounding: [] };
  }
}
