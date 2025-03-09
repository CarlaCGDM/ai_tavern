import { OrbitControls } from "@react-three/drei";

export default function SceneSetup() {
    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="light green" />
            </mesh>
        </>
    );
}