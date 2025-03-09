import { OrbitControls, useGLTF, Environment, Sky } from "@react-three/drei";

export default function SceneSetup() {

    const gltf = useGLTF(process.env.PUBLIC_URL + "/assets/models/island/island.glb");

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.25} color="blue"/>
            <Environment preset="forest" />
        <Sky />
            <primitive object={gltf.scene} />
            {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="lightGreen" />
            </mesh> */}
        </>
    );
}