import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { useGenerativeAI } from "../hooks/useGenerativeAI";
import { useConversation } from "../hooks/useConversation";
import { useCollisionDetection } from "../hooks/useCollisionDetection";
import SceneSetup from "./SceneSetup";
import FriendshipDisplay from "./FriendshipDisplay";

export default function Scene() {
    const charactersRef = useRef([]);
    const { getCharacterResponse } = useGenerativeAI();
    const { conversationActive, cooldown, startConversation } = useConversation(getCharacterResponse);
    useCollisionDetection(charactersRef.current, startConversation, conversationActive, cooldown);

    // Extract friendship data for display
    const friendshipData = charactersRef.current.map((character) => ({
        name: character.name,
        friendshipIndex: character.friendshipIndex || {},
    }));

    return (
        <>
            <Canvas>
                <SceneSetup charactersRef={charactersRef} />
            </Canvas>
            <FriendshipDisplay characters={friendshipData} />
        </>
    );
}