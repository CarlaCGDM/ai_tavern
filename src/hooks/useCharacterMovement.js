import { useState, useEffect, useCallback } from "react";

export const useCharacterMovement = (meshRef, isTalking) => {
    const [targetPosition, setTargetPosition] = useState([0, 0, 0]);

    // Generate a random target position
    const generateRandomPosition = useCallback(() => {
        const x = Math.random() * 20 - 10; // Random X between -10 and 10
        const z = Math.random() * 20 - 10; // Random Z between -10 and 10
        return [x, 0, z];
    }, []);

    // Move the character toward the target position
    const move = useCallback(() => {
        if (!meshRef.current || isTalking) return; // Stop moving if talking

        const speed = 0.03;
        const [x, y, z] = meshRef.current.position;
        const [tx, ty, tz] = targetPosition;

        // Calculate the direction vector
        const dx = tx - x;
        const dz = tz - z;

        // Move toward the target
        meshRef.current.position.x += dx * speed;
        meshRef.current.position.z += dz * speed;

        // Rotate to face the target
        const angle = Math.atan2(dx, dz);
        meshRef.current.rotation.y = angle;

        // Check if the character has reached the target
        if (Math.abs(dx) < 0.1 && Math.abs(dz) < 0.1) {
            setTargetPosition(generateRandomPosition()); // Set a new target
        }
    }, [isTalking, targetPosition, meshRef, generateRandomPosition]);

    // Update movement on every frame
    useEffect(() => {
        const interval = setInterval(move, 1000 / 60); // 60 FPS
        return () => clearInterval(interval);
    }, [move]);

    // Set initial target position
    useEffect(() => {
        setTargetPosition(generateRandomPosition());
    }, [generateRandomPosition]);

    return { targetPosition };
};