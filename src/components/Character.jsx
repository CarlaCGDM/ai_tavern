import { useRef, useImperativeHandle, forwardRef, useState, useEffect, Suspense } from "react";
import { useGLTF, Clone, Html } from "@react-three/drei";
import { useCharacterMovement } from "../hooks/useCharacterMovement";
import { useFriendshipIndex } from "../hooks/useFriendshipIndex";
import { useCharacterMessage } from "../hooks/useCharacterMessage";
import CharacterMessage from "./CharacterMessage";

const Character = forwardRef(
    (
        {
            color = "red",
            position = [0, 0, 0],
            name = "character",
            message = "",
            characterization = "friendly",
            modelUrl = "/assets/models/characters/defaultCharacter.glb",
        },
        ref
    ) => {
        const meshRef = useRef();
        const [isTalking, setIsTalking] = useState(false);
        const [isInteractingWithProp, setIsInteractingWithProp] = useState(false);
        const { targetPosition } = useCharacterMovement(meshRef, isTalking || isInteractingWithProp);
        const { friendshipIndex, updateFriendship } = useFriendshipIndex();
        const { currentMessage, setCurrentMessage, currentEmotion, setCurrentEmotion } = useCharacterMessage(message);

        // Load the character model
        const gltf = useGLTF(process.env.PUBLIC_URL + modelUrl);

        // Expose methods and properties to the parent component
        useImperativeHandle(ref, () => ({
            setMessage: (newMessage) => setCurrentMessage(newMessage),
            setEmotion: (newEmotion) => setCurrentEmotion(newEmotion),
            setIsTalking: (talking) => setIsTalking(talking),
            setIsInteractingWithProp: (interacting) => setIsInteractingWithProp(interacting),
            updateFriendship,
            friendshipIndex,
            position: meshRef.current?.position,
            meshRef: meshRef,
            name,
            characterization,
            isInteractingWithProp,
        }));

        return (
            <group ref={meshRef} position={position}>
                {/* Debugging: Visualize the group's position */}
                <mesh position={[0, 1, 0]}>
                    <boxGeometry args={[0.5, 2, 0.5]} />
                    <meshStandardMaterial color="red" wireframe />
                </mesh>

                {/* Character Model */}
                <Suspense fallback={<Html center><span>Loading...</span></Html>}>
                    <primitive object={gltf.scene} position={[0, 0, 0]} /> {/* Ensure position is [0, 0, 0] */}
                </Suspense>

                {/* Character Message */}
                <CharacterMessage message={currentMessage} color={color} name={name} />
            </group>
        );
    }
);

export default Character;