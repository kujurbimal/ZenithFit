
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const foodSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'Name of the food item.' },
    calories: { type: Type.NUMBER, description: 'Total calories per serving.' },
    protein: { type: Type.NUMBER, description: 'Grams of protein per serving.' },
    carbs: { type: Type.NUMBER, description: 'Grams of carbohydrates per serving.' },
    fat: { type: Type.NUMBER, description: 'Grams of fat per serving.' },
  },
  required: ['name', 'calories', 'protein', 'carbs', 'fat'],
};

export const getFoodNutrition = async (foodQuery: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide nutritional information for a standard serving of: ${foodQuery}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: foodSchema,
      },
    });
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error fetching food nutrition from Gemini:", error);
    throw new Error("Could not fetch nutritional information. Please try again.");
  }
};

export const getPersonalizedTip = async (userData: { calories: number; goal: number; lastActivity: string }) => {
  const prompt = `
    Based on the following user data, provide a short, encouraging, and actionable fitness or nutrition tip.
    - Today's calories consumed: ${userData.calories}
    - Daily calorie goal: ${userData.goal}
    - Last activity: ${userData.lastActivity}
    
    Keep the tip to one or two sentences.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching personalized tip from Gemini:", error);
    return "Remember to stay hydrated and listen to your body!";
  }
};
