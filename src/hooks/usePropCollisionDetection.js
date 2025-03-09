import { useCallback, useEffect } from "react";

export const usePropCollisionDetection = (characters, props, handlePropInteraction, conversationActive, cooldown, propCooldown) => {
    const detectPropCollisions = useCallback(() => {
        if (conversationActive || cooldown || propCooldown) return; // Skip if in cooldown


        for (let i = 0; i < characters.length; i++) {
            for (let j = 0; j < props.length; j++) {
                const character = characters[i];
                const prop = props[j];

                if (!character || !prop) continue;

                // Calculate distance between character and prop
                const dx = character.position.x - prop.position.x;
                const dz = character.position.z - prop.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);

                // If character is close enough, start a prop interaction
                if (distance < prop.size.x) {
                    console.log("collided with prop!")
                    handlePropInteraction(character, prop);
                }
            }
        }
    }, [characters, props, handlePropInteraction, conversationActive, cooldown, propCooldown]);

    // Update prop collision detection on every frame
    useEffect(() => {
        const interval = setInterval(detectPropCollisions, 1000 / 60); // 60 FPS
        return () => clearInterval(interval);
    }, [detectPropCollisions]);
};