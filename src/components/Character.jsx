import { useRef, useImperativeHandle, forwardRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
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

        const animationMapping = {
            walk: "Walking_C", // Map "walk" state to your custom walk animation
            talk: "Idle", // Map "talk" state to your custom talk animation
            interact: "Idle", // Map "interact" state to your custom interact animation
            happy: "Cheer", // Map "happy" emotion to your custom happy animation
            angry: "Throw", // Map "angry" emotion to your custom angry animation
            sad: "PickUp", // Map "sad" emotion to your custom sad animation
            shocked: "Hit_A", // Map "shocked" emotion to your custom shocked animation
        };

        // Track the previous emotion to detect changes
        const prevEmotionRef = useRef(currentEmotion);

        // Animation management
        useEffect(() => {
            const fadeDuration = 0.2; // Duration of the fade transition

            // Handle emotion-based animations
            if (currentEmotion !== prevEmotionRef.current && currentEmotion !== "idle") {
                // Stop all other animations
                Object.values(actions).forEach((action) => {
                    if (action.isRunning()) {
                        action.fadeOut(fadeDuration);
                    }
                });

                // Play the emotion animation once
                const emotionAnimation = actions[animationMapping[currentEmotion]];
                if (emotionAnimation) {
                    emotionAnimation.reset().fadeIn(fadeDuration).play();
                    emotionAnimation.clampWhenFinished = true; // Stop at the last frame
                    emotionAnimation.loop = THREE.LoopOnce; // Play once

                    // Return to default animation after the emotion animation finishes
                    emotionAnimation.getMixer().addEventListener("finished", () => {
                        if (isTalking) {
                            actions[animationMapping.talk]?.reset().fadeIn(fadeDuration).play();
                        } else if (isInteractingWithProp) {
                            actions[animationMapping.interact]?.reset().fadeIn(fadeDuration).play();
                        } else {
                            actions[animationMapping.walk]?.reset().fadeIn(fadeDuration).play();
                        }
                    });
                }
            }

            // Update the previous emotion
            prevEmotionRef.current = currentEmotion;
        }, [currentEmotion, actions, isTalking, isInteractingWithProp]);

        // Handle default animations (walking, talking, interacting)
        useEffect(() => {
            const fadeDuration = 0.2; // Duration of the fade transition

            if (isTalking) {
                // Fade out all other animations
                Object.values(actions).forEach((action) => {
                    if (action.isRunning() && action !== actions[animationMapping.talk]) {
                        action.fadeOut(fadeDuration);
                    }
                });
                // Fade in the "Talk" animation
                actions[animationMapping.talk]?.reset().fadeIn(fadeDuration).play();
            } else if (isInteractingWithProp) {
                // Fade out all other animations
                Object.values(actions).forEach((action) => {
                    if (action.isRunning() && action !== actions[animationMapping.interact]) {
                        action.fadeOut(fadeDuration);
                    }
                });
                // Fade in the "Interact" animation
                actions[animationMapping.interact]?.reset().fadeIn(fadeDuration).play();
            } else {
                // Fade out all other animations
                Object.values(actions).forEach((action) => {
                    if (action.isRunning() && action !== actions[animationMapping.walk]) {
                        action.fadeOut(fadeDuration);
                    }
                });
                // Fade in the "Walk" animation
                actions[animationMapping.walk]?.reset().fadeIn(fadeDuration).play();
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