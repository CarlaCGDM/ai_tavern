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
            <Character
                ref={(el) => (charactersRef.current[4] = el)}
                position={[-1, 0, -1]}
                color="#948c1c"
                name="Celebrity"
                characterization="obnoxious uncharismatic celebrity, breaking down because fame didn't bring him friends"
            />
        </>
    );
}