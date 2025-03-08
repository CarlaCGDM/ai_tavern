import { OrbitControls } from "@react-three/drei";
import { useState, useEffect, useRef, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Character from "./Character";

export default function Scene() {

    // Initialize the generative model
    const genAI = new GoogleGenerativeAI("AIzaSyD0B-CjCwj_m65Ow22AIEX2GQgsXTFK_Ec");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const charactersRef = useRef([]);
    const [conversationActive, setConversationActive] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const cooldownTimeoutRef = useRef(null); // Ref to track the timeout
    const [lastMessages, setLastMessages] = useState({});

    useEffect(() => {
        console.log(lastMessages); // Will log correctly when state updates
      }, [lastMessages]);

    // Simulate a conversation between two characters
    const startConversation = async (char1, char2) => {
        setConversationActive(true);
        setCooldown(true);

        // Stop movement
        char1.setIsTalking(true);
        char2.setIsTalking(true);

        // Face each other
        const dx = char2.position.x - char1.position.x;
        const dz = char2.position.z - char1.position.z;
        const angle1 = Math.atan2(dx, dz);
        const angle2 = Math.atan2(-dx, -dz);

        char1.meshRef.current.rotation.y = angle1;
        char2.meshRef.current.rotation.y = angle2;

        // Initialize last messages
        setLastMessages({ [char1.name]: "", [char2.name]: "" });

        // Exchange messages
        for (let i = 0; i < 4; i++) { // Limit to 4 exchanges
            // Generate response for char1 based on char2's last message
            const response1 = await getCharacterResponse(
                char1,
                char2,
                lastMessages[char2.name] || `Start a conversation with a ${char2.characterization} as if you were ${char1.characterization}.`
            );
            char1.setMessage(response1.characterMessage);
            char1.setEmotion(response1.characterEmotion);
            char2.setMessage("");
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 1 second
            
            // Generate response for char2 based on char1's last message
            const response2 = await getCharacterResponse(
                char2,
                char1,
                response1.characterMessage
            );
            char2.setMessage(response2.characterMessage);
            char2.setEmotion(response2.characterEmotion);
            char1.setMessage("");

            setLastMessages((prev) => ({
                ...prev,
                [char1.name]: response1.characterMessage,
                [char2.name]: response2.characterMessage,
              }));

            await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 1 second
        }

        // End conversation
        char1.setMessage("");
        char2.setMessage("");
        char1.setIsTalking(false);
        char2.setIsTalking(false);
        setConversationActive(false);

        // Move characters slightly apart
        char1.meshRef.current.position.x += 1; // Move Pink to the right
        char2.meshRef.current.position.x -= 1; // Move Blue to the left

        // Use a ref to track the timeout
        cooldownTimeoutRef.current = setTimeout(() => {
            setCooldown(false);
            cooldownTimeoutRef.current = null; // Clear the ref after the timeout
        }, 3000); // 3-second cooldown
    };

    // Function to make API call
    const getCharacterResponse = async (char1, char2, userMessage) => {
        const prompt = `Reply in under 200 characters to the following message from a ${char2.characterization} as if you were ${char1.characterization}: "${userMessage}". Also, choose an emotion from this list that matches your response: [idle, angry, happy, sad, shocked]. Return your response as a JSON object with keys "characterMessage" and "characterEmotion".`;

        const result = await model.generateContent(prompt);
        const response = result.response.text()

        const cleanedResponse = response.replace(/```json|```/g, "").trim();

        try {
            return JSON.parse(cleanedResponse); // Parse the cleaned response
        } catch (error) {
            console.error("Error parsing AI response:", error);
            return { characterMessage: "Error generating response.", characterEmotion: "idle" };
        }
    };

    // Detect collisions between characters
    const detectCollisions = useCallback(() => {
        if (conversationActive || cooldown) return; // Skip if a conversation is already active

        const characters = charactersRef.current;

        for (let i = 0; i < characters.length; i++) {
            for (let j = i + 1; j < characters.length; j++) {
                const char1 = characters[i];
                const char2 = characters[j];

                if (!char1 || !char2) continue;

                // Calculate distance between characters
                const dx = char1.position.x - char2.position.x;
                const dz = char1.position.z - char2.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);

                // If characters are close enough, start a conversation
                if (distance < 1) {
                    startConversation(char1, char2);
                }
            }
        }
    }, [conversationActive, cooldown]);

    // Update collision detection on every frame
    useEffect(() => {
        const interval = setInterval(detectCollisions, 1000 / 60); // 60 FPS
        return () => clearInterval(interval);
    }, [conversationActive, cooldown, detectCollisions, startConversation]); // Add cooldown to dependencies

    // Cleanup the timeout on component unmount
    useEffect(() => {
        return () => {
            if (cooldownTimeoutRef.current) {
                clearTimeout(cooldownTimeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="light green" />
            </mesh>
            <Character
                ref={(el) => (charactersRef.current[0] = el)}
                position={[2, 0, 2]}
                color="red"
                name="Knight"
                characterization="shy medieval knight"
            />
            <Character
                ref={(el) => (charactersRef.current[1] = el)}
                position={[6, 0, 6]}
                color="green"
                name="Alien"
                characterization="alien from Mars who is easily angered"
            />
            <Character
                ref={(el) => (charactersRef.current[2] = el)}
                color="blue"
                name="Wizard"
                characterization="wise old wizard"
            />
            <Character
                ref={(el) => (charactersRef.current[3] = el)}
                position={[-3, 0, -3]}
                color="darkGray"
                name="Ghost"
                characterization="weeping ghost looking for her lost love"
            />
        </>
    );
}