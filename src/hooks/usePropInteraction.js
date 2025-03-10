import { useState, useCallback } from "react";

export const usePropInteraction = (getCharacterResponse) => {
    const [propCooldown, setPropCooldown] = useState(false);

    const handlePropInteraction = useCallback(async (character, prop) => {

        if (!propCooldown && Math.random() < 1 / 2) { // 1 in 2 chance of making a comment

            character.setIsInteractingWithProp(true);
            setPropCooldown(true); // Start cooldown

            // Face the prop
            const dx = prop.position.x - character.position.x;
            const dz = prop.position.z - character.position.z;
            const angle = Math.atan2(dx, dz);
            character.meshRef.current.rotation.y = angle;

            // Generate a response about the prop
            const response = await getCharacterResponse(
                character,
                { characterization: prop.description }, // Treat the prop as a "character"
                `You see a ${prop.description}. What do you think about it?`,
                0 // No friendship level for props
            );
            character.setMessage(response.characterMessage);
            character.setEmotion(response.characterEmotion);

            // Wait for 5 seconds
            await new Promise((resolve) => setTimeout(resolve, 5000));

            // Turn around and walk away
            character.meshRef.current.rotation.y = angle + Math.PI; // Turn 180 degrees

            character.setMessage(""); // Clear the message
            character.setIsInteractingWithProp(false); // Reset interaction state

            // End cooldown after 5 seconds
            setTimeout(() => {
                setPropCooldown(false); // End cooldown
            }, 5000);
        }

    }, [getCharacterResponse]);

    return { propCooldown, handlePropInteraction };
};