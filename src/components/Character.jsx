import { useRef, useImperativeHandle, forwardRef, useState } from "react";
import { useCharacterMovement } from "../hooks/useCharacterMovement";
import { useFriendshipIndex } from "../hooks/useFriendshipIndex";
import { useCharacterMessage } from "../hooks/useCharacterMessage";
import CharacterMessage from "./CharacterMessage";

const Character = forwardRef(({
    color = "red",
    position = [0, 0, 0],
    name = "character",
    message = "",
    characterization = "friendly"
}, ref) => {
    const meshRef = useRef();
    const [isTalking, setIsTalking] = useState(false);
    const [isInteractingWithProp, setIsInteractingWithProp] = useState(false); // 🚨 **ADDED**: Prop interaction state
    const { targetPosition } = useCharacterMovement(meshRef, isTalking || isInteractingWithProp); // 🚨 **UPDATED**: Include prop interaction
    const { friendshipIndex, updateFriendship } = useFriendshipIndex();
    const { currentMessage, setCurrentMessage, currentEmotion, setCurrentEmotion } = useCharacterMessage(message);

    // Expose methods and properties to the parent component
    useImperativeHandle(ref, () => ({
        setMessage: (newMessage) => setCurrentMessage(newMessage),
        setEmotion: (newEmotion) => setCurrentEmotion(newEmotion),
        setIsTalking: (talking) => setIsTalking(talking),
        setIsInteractingWithProp: (interacting) => setIsInteractingWithProp(interacting), // 🚨 **ADDED**: Expose prop interaction
        updateFriendship,
        friendshipIndex,
        position: meshRef.current?.position,
        meshRef: meshRef, // Expose meshRef
        name,
        characterization,
        isInteractingWithProp
    }));

    return (
        <>
            <group ref={meshRef} position={position}>
                <mesh position={[0, 0.5, 0]}>
                    <CharacterMessage message={currentMessage} color={color} name={name} />
                    <boxGeometry args={[0.5, 1, 0.5]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            </group >
        </>
    );
});

export default Character;