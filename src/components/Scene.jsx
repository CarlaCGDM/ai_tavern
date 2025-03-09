import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { useGenerativeAI } from "../hooks/useGenerativeAI";
import { useConversation } from "../hooks/useConversation";
import { useCollisionDetection } from "../hooks/useCollisionDetection";
import { usePropCollisionDetection } from "../hooks/usePropCollisionDetection";
import { usePropInteraction } from "../hooks/usePropInteraction"; // 🚨 **ADDED**: Import the new hook
import SceneSetup from "./setup/SceneSetup";
import PropsSetup from "./setup/PropsSetup";
import CharacterSetup from "./setup/CharactersSetup";
import FriendshipDisplay from "./FriendshipDisplay";

export default function Scene() {
    const charactersRef = useRef([]);
    const propsRef = useRef([]);
    const { getCharacterResponse } = useGenerativeAI();
    const { conversationActive, cooldown, startConversation } = useConversation(getCharacterResponse);
    const { propCooldown, handlePropInteraction } = usePropInteraction(getCharacterResponse); // 🚨 **ADDED**: Use the new hook

    // Use collision detection hooks
    useCollisionDetection(charactersRef.current, startConversation, conversationActive, cooldown);
    usePropCollisionDetection(
        charactersRef.current,
        propsRef.current,
        handlePropInteraction,
        conversationActive,
        cooldown,
        propCooldown
    );

    // Extract friendship data for display
    const friendshipData = charactersRef.current.map((character) => ({
        name: character.name,
        friendshipIndex: character.friendshipIndex || {},
    }));

    return (
        <>
            <Canvas>
                <SceneSetup />
                <PropsSetup propsRef={propsRef} />
                <CharacterSetup charactersRef={charactersRef} />
            </Canvas>
            <FriendshipDisplay characters={friendshipData} />
        </>
    );
}