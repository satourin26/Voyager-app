
import { GoogleGenAI } from "@google/genai";
import { GroundingLink } from "../types";

const API_KEY = process.env.API_KEY || "";

/**
 * Uses Gemini to find the Google Maps URL and basic info for a location/activity.
 */
export const lookupLocationDetails = async (activity: string, destination: string): Promise<GroundingLink | null> => {
  if (!API_KEY) return null;
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `Find the official Google Maps link and exact name for: "${activity}" in ${destination}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-latest",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapsChunk = groundingChunks.find((chunk: any) => chunk.maps);

    if (mapsChunk && mapsChunk.maps) {
      return {
        title: mapsChunk.maps.title,
        uri: mapsChunk.maps.uri
      };
    }
    return null;
  } catch (error) {
    console.error("Gemini Location Lookup Error:", error);
    return null;
  }
};

/**
 * Uses Gemini Search to find real-time transit information (like 乘換案內 / Jorudan).
 */
export const lookupTransitDetails = async (activity: string, destination: string): Promise<GroundingLink | null> => {
  if (!API_KEY) return null;
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `Search for the best real-time transit route/guide for reaching "${activity}" in ${destination}. 
  Provide a summary of the most common transit method (e.g. "JR Kobe Line") and a link to a real-time transit guide like 乘換案內 (Jorudan) or Google Maps Transit.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Using a model with googleSearch capability
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Find the first relevant web link from search grounding
    const searchLink = groundingChunks.find((chunk: any) => chunk.web)?.web;

    if (searchLink) {
      // Create a short summary from the text if possible
      const summary = text.split('\n')[0].substring(0, 50) + (text.length > 50 ? '...' : '');
      return {
        title: summary || searchLink.title,
        uri: searchLink.uri
      };
    }
    
    return null;
  } catch (error) {
    console.error("Gemini Transit Lookup Error:", error);
    return null;
  }
};
