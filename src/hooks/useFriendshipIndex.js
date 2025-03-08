import { useState } from "react";

export const useFriendshipIndex = () => {
    const [friendshipIndex, setFriendshipIndex] = useState({});

    // Update friendship index
    const updateFriendship = (otherCharacter, emotion) => {
        setFriendshipIndex((prev) => {
            const currentPoints = prev[otherCharacter] || 0;
            let newPoints = currentPoints;

            if (emotion === "happy" || emotion === "idle") {
                newPoints += 1; // Increase points for positive response
            } else if (emotion === "sad" || emotion === "angry") {
                newPoints -= 1; // Decrease points for negative response
            }

            return { ...prev, [otherCharacter]: newPoints };
        });
    };

    return { friendshipIndex, updateFriendship };
};