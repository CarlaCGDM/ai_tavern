import { Html } from "@react-three/drei";

export default function CharacterMessage({ message, color, name }) {
    // Styles for the message
    const messageStyle = {
        backgroundColor: color,
        color: "white",
        padding: "10%",
        borderRadius: "10px",
        maxWidth: "300px",
        width: "200px",
        textAlign: "left",
        fontSize: "16px",
        margin: "0 auto",
        wordWrap: "break-word",
        whiteSpace: "normal",
    };

    return (
        <>
            {message && (
                <Html as="div" center position={[0, 2, 0]}>
                    <p style={messageStyle}>{message}</p>
                </Html>
            )}
            <Html as="div" center position={[0, 0.7, 0]}>
                <p>{name}</p>
            </Html>
        </>
    );
}