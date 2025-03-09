import { useRef, useImperativeHandle, forwardRef, useState, useEffect, Suspense } from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
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
            modelUrl = "/assets/models/characters/Knight.glb",
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
        const { scene, animations } = useGLTF(process.env.PUBLIC_URL + modelUrl);
        const { actions } = useAnimations(animations, meshRef);

        console.log(actions)

        useEffect(() => {
            const fadeDuration = 0.2; // Duration of the fade transition
        
            if (isTalking) {
                // Fade out all other animations
                Object.values(actions).forEach((action) => {
                    if (action.isRunning() && action !== actions["Idle"]) {
                        action.fadeOut(fadeDuration);
                    }
                });
                // Fade in the "Talk" animation
                actions["Idle"]?.reset().fadeIn(fadeDuration).play();
            } else if (isInteractingWithProp) {
                // Fade out all other animations
                Object.values(actions).forEach((action) => {
                    if (action.isRunning() && action !== actions["Idle"]) {
                        action.fadeOut(fadeDuration);
                    }
                });
                // Fade in the "Interact" animation
                actions["Idle"]?.reset().fadeIn(fadeDuration).play();
            } else {
                // Fade out all other animations
                Object.values(actions).forEach((action) => {
                    if (action.isRunning() && action !== actions["Walking_C"]) {
                        action.fadeOut(fadeDuration);
                    }
                });
                // Fade in the "Walk" animation
                actions["Walking_C"]?.reset().fadeIn(fadeDuration).play();
            }
        }, [isTalking, isInteractingWithProp, actions]);

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
                {/* <mesh position={[0, 1, 0]}>
                    <boxGeometry args={[1, 2, 1]} />
                    <meshStandardMaterial color="red" wireframe />
                </mesh> */}

                {/* Character Model */}
                <Suspense fallback={<Html center><span>Loading...</span></Html>}>
                    <primitive object={scene} position={[0, -0.05, 0]} /> {/* Ensure position is [0, 0, 0] */}
                </Suspense>

                {/* Character Message */}
                <CharacterMessage message={currentMessage} color={color} name={name} />
            </group>
        );
    }
);

export default Character;