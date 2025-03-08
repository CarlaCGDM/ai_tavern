import { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";
import { Html } from "@react-three/drei";

const Character = forwardRef(({
    color = "red",
    position = [0, 0, 0],
    name = "character",
    message = "",
    characterization = "friendly"
}, ref) => {
    const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
    const [currentMessage, setCurrentMessage] = useState(message);
    // eslint-disable-next-line no-unused-vars
    const [currentEmotion, setCurrentEmotion] = useState("idle");
    const [friendshipIndex, setFriendshipIndex] = useState({}); // Friendship index
    const [isTalking, setIsTalking] = useState(false);
    const meshRef = useRef();

    // Generate a random target position
    const generateRandomPosition = () => {
        const x = Math.random() * 20 - 10; // Random X between -10 and 10
        const z = Math.random() * 20 - 10; // Random Z between -10 and 10
        return [x, 0, z];
    };

    // Move the character toward the target position
    const move = useCallback(() => {
        if (!meshRef.current || isTalking) return; // Stop moving if talking

        const speed = 0.03;
        // eslint-disable-next-line no-unused-vars
        const [x, y, z] = meshRef.current.position;
        // eslint-disable-next-line no-unused-vars
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
    }, [isTalking, targetPosition]);

    // Update movement on every frame
    useEffect(() => {
        const interval = setInterval(move, 1000 / 60); // 60 FPS
        return () => clearInterval(interval);
    }, [move]);

    // Set initial target position
    useEffect(() => {
        setTargetPosition(generateRandomPosition());
    }, []);

    // Update friendship index
    const updateFriendship = (otherCharacter, emotion) => {
        setFriendshipIndex((prev) => {
            const currentPoints = prev[otherCharacter] || 0;
            let newPoints = currentPoints;

            if (emotion === "happy") {
                newPoints += 1; // Increase points for positive response
            } else if (emotion === "sad" || emotion === "angry") {
                newPoints -= 1; // Decrease points for negative response
            }

            return { ...prev, [otherCharacter]: newPoints };
        });
    };

    // Expose methods and properties to the parent component
    useImperativeHandle(ref, () => ({
        setMessage: (newMessage) => setCurrentMessage(newMessage),
        setEmotion: (newEmotion) => setCurrentEmotion(newEmotion),
        setIsTalking: (talking) => setIsTalking(talking),
        updateFriendship,
        friendshipIndex,
        position: meshRef.current?.position,
        meshRef: meshRef, // Expose meshRef
        name,
        characterization,
    }));

    // Inline styles for the message
    const messageStyle = {
        backgroundColor: color,
        color: "white",
        padding: "10%",
        borderRadius: "10px",
        maxWidth: "300px",
        width: "200px",
        textAlign: "left",
        fontSize: "16px",
        margin: "0 auto",
        wordWrap: "break-word",
        whiteSpace: "normal",
    };

    return (
        <>
            <mesh ref={meshRef} position={position}>
                {currentMessage && <Html as="div" center position={[0, 2, 0]}>
                    <p style={messageStyle}>{currentMessage}</p>
                </Html>}
                <Html as="div" center position={[0, 0.7, 0]}>
                    <p>{name}</p>
                </Html>
                <boxGeometry args={[0.5, 1, 0.5]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </>
    );
});

export default Character;