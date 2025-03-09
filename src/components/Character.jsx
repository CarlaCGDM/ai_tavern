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
        const {scene, animations} = useGLTF(process.env.PUBLIC_URL + modelUrl);
        const { actions } = useAnimations(animations, meshRef);

        console.log(actions)

        // Play animations based on character state
        useEffect(() => {
            if (isTalking) {
                actions["Idle"]?.play();
            } else if (isInteractingWithProp) {
                actions["Idle"]?.play();
            } else {
                actions["Walking_C"]?.play();
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
                    <primitive object={scene} position={[0, 0, 0]} /> {/* Ensure position is [0, 0, 0] */}
                </Suspense>

                {/* Character Message */}
                <CharacterMessage message={currentMessage} color={color} name={name} />
            </group>
        );
    }
);

export default Character;