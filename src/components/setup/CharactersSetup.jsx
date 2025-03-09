import Character from "../Character";

export default function CharacterSetup({ charactersRef }) {
    return (
        <>
            <Character
                ref={(el) => (charactersRef.current[0] = el)}
                position={[2, 0, 2]}
                color="red"
                name="Knight"
                characterization="shy medieval knight looking for true love"
                modelUrl="/assets/models/characters/Knight.glb"
            />
            <Character
                ref={(el) => (charactersRef.current[1] = el)}
                position={[6, 0, 6]}
                color="green"
                name="Barbarian"
                characterization="barbarian warrior looking for a fight"
                modelUrl="/assets/models/characters/Barbarian.glb"
            />
            <Character
                ref={(el) => (charactersRef.current[2] = el)}
                color="blue"
                name="Wizard"
                characterization="wise wizard seeking knowledge"
                modelUrl="/assets/models/characters/Mage.glb"
            />
            <Character
                ref={(el) => (charactersRef.current[3] = el)}
                position={[-3, 0, -3]}
                color="darkGray"
                name="Rogue"
                characterization="kind medieval rogue looking for friends"
                modelUrl="/assets/models/characters/Rogue.glb"
            />
        </>
    );
}