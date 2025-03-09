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

    const nameStyle = {
        backgroundColor: "black",
        color: "white",
        padding: "10%",
        borderRadius: "10px",
        maxWidth: "300px",
        width: "75px",
        textAlign: "left",
        fontSize: "13px",
        margin: "0 auto",
        wordWrap: "break-word",
        whiteSpace: "normal",
        textAlign: "center",
    };

    return (
        <>
            {message && (
                <Html as="div" center position={[0, 4, 0]}>
                    <p style={messageStyle}>{message}</p>
                </Html>
            )}
            <Html as="div" center position={[0, 3, 0]}>
                <p style={nameStyle}>{name}</p>
            </Html>
        </>
    );
}