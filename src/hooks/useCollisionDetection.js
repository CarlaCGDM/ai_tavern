import { useCallback, useEffect } from "react";

export const useCollisionDetection = (characters, startConversation, conversationActive, cooldown) => {
    const detectCollisions = useCallback(() => {
        if (conversationActive || cooldown) return; // Skip if a conversation is already active

        for (let i = 0; i < characters.length; i++) {
            for (let j = i + 1; j < characters.length; j++) {
                const char1 = characters[i];
                const char2 = characters[j];

                if (!char1 || !char2) continue;

                // Calculate distance between characters
                const dx = char1.position.x - char2.position.x;
                const dz = char1.position.z - char2.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);

                // If characters are close enough, start a conversation
                if (distance < 1) {
                    startConversation(char1, char2);
                }
            }
        }
    }, [characters, conversationActive, cooldown, startConversation]);

    // Update collision detection on every frame
    useEffect(() => {
        const interval = setInterval(detectCollisions, 1000 / 60); // 60 FPS
        return () => clearInterval(interval);
    }, [detectCollisions]);
};