// hooks/useGenerativeAI.js
import { useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const useGenerativeAI = () => {
    const genAI = new GoogleGenerativeAI("AIzaSyD0B-CjCwj_m65Ow22AIEX2GQgsXTFK_Ec");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const getCharacterResponse = useCallback(async (char1, char2, userMessage, friendshipLevel = 0) => {
        let friendshipContext = "";
        if (friendshipLevel > 10) {
            friendshipContext = "You LOVE this person.";
        } else if (friendshipLevel < -10) {
            friendshipContext = "You HATE this person.";
        }

        const prompt = `Reply in under 200 characters to the following message from a ${char2.characterization} as if you were ${char1.characterization}. ${friendshipContext}: "${userMessage}". Also, choose an emotion from this list that matches your response: [idle, angry, happy, sad, shocked]. Return your response as a JSON object with keys "characterMessage" and "characterEmotion".`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        const cleanedResponse = response.replace(/```json|```/g, "").trim();

        try {
            return JSON.parse(cleanedResponse); // Parse the cleaned response
        } catch (error) {
            console.error("Error parsing AI response:", error);
            return { characterMessage: "Error generating response.", characterEmotion: "idle" };
        }
    }, [model]);

    return { getCharacterResponse };
};