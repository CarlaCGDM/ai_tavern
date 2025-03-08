import { useState } from "react";

export const useCharacterMessage = (initialMessage = "") => {
    const [currentMessage, setCurrentMessage] = useState(initialMessage);
    const [currentEmotion, setCurrentEmotion] = useState("idle");

    return { currentMessage, setCurrentMessage, currentEmotion, setCurrentEmotion };
};