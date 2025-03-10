import { useState, useCallback } from "react";

export const useConversation = (getCharacterResponse) => {
    const [conversationActive, setConversationActive] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [lastMessages, setLastMessages] = useState({});

    const startConversation = useCallback(async (char1, char2) => {
        setConversationActive(true);
        setCooldown(true);

        // Stop movement
        char1.setIsTalking(true);
        char2.setIsTalking(true);

        // Face each other
        const dx = char2.position.x - char1.position.x;
        const dz = char2.position.z - char1.position.z;
        const angle1 = Math.atan2(dx, dz);
        const angle2 = Math.atan2(-dx, -dz);

        char1.meshRef.current.rotation.y = angle1;
        char2.meshRef.current.rotation.y = angle2;

        // Initialize last messages
        setLastMessages({ [char1.name]: "", [char2.name]: "" });

        // Exchange messages
        for (let i = 0; i < 2; i++) { // Limit to 2 exchanges
            const response1 = await getCharacterResponse(
                char1,
                char2,
                lastMessages[char2.name] || `Start a conversation with a ${char2.characterization} as if you were ${char1.characterization}.`,
                char1.friendshipIndex[char2.name]
            );
            char1.setMessage(response1.characterMessage);
            char1.setEmotion(response1.characterEmotion);
            char2.setMessage("");
            char2.updateFriendship(char1.name, response1.characterEmotion);
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds

            const response2 = await getCharacterResponse(
                char2,
                char1,
                response1.characterMessage,
                char2.friendshipIndex[char1.name]
            );
            char2.setMessage(response2.characterMessage);
            char2.setEmotion(response2.characterEmotion);
            char1.setMessage("");
            char1.updateFriendship(char2.name, response2.characterEmotion);

            setLastMessages((prev) => ({
                ...prev,
                [char1.name]: response1.characterMessage,
                [char2.name]: response2.characterMessage,
            }));

            await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
        }

        // End conversation
        char1.setMessage("");
        char2.setMessage("");
        char1.setIsTalking(false);
        char2.setIsTalking(false);
        setConversationActive(false);

        // Use a ref to track the timeout
        setTimeout(() => {
            setCooldown(false);
        }, 5000); // 5-second cooldown
    }, [getCharacterResponse, lastMessages]);

    return { conversationActive, cooldown, startConversation };
};