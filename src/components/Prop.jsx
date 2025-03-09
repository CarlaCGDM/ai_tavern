import { useLoader } from "@react-three/fiber";
import { Html, Clone, useGLTF } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { forwardRef, Suspense, useState, useEffect } from "react";
import * as THREE from "three";

const Model = ({ modelUrl, onComputedSize }) => {
    const gltf = useGLTF(process.env.PUBLIC_URL + modelUrl);

    useEffect(() => {
        if (gltf.scene) {
            const bbox = new THREE.Box3().setFromObject(gltf.scene);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            onComputedSize(size); // Ensure size updates when the model changes
        }
    }, [gltf.scene, onComputedSize]); // React updates only when the model changes

    return <Clone object={gltf.scene} />;
};


const Prop = forwardRef(({ position, rotation, description, modelUrl }, ref) => {
    const [validUrl, setValidUrl] = useState("/assets/models/treasureChest.glb"); // Fallback model
    const [size, setSize] = useState(new THREE.Vector3(1, 1, 1)); // Default size

    // Convert degrees to radians
    const radRotation = rotation.map(THREE.MathUtils.degToRad);

    useEffect(() => {
        if (modelUrl) {
            setValidUrl(modelUrl);
        }
    }, [modelUrl]);

    return (
        <group ref={ref} position={position} rotation={radRotation || [0, 0, 0]} size={size} description={description}>
            {/* Debugging Collider */}
            <mesh position={[0, size.y / 2, 0]}>
                <boxGeometry args={[size.x, size.y, size.z]} />
                <meshStandardMaterial visible={true} color="black" wireframe />
            </mesh>

            {/* Load the model with suspense */}
            <Suspense fallback={<Html center><span>Loading...</span></Html>}>
                <Model modelUrl={validUrl} onComputedSize={setSize} />
            </Suspense>

            {/* Floating text description */}
            <Html as="div" center position={[0, size.y * 1.5, 0]}>
                <p style={{
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    padding: "5px",
                    borderRadius: "5px"
                }}>
                    {description}
                </p>
            </Html>
        </group>
    );
});

export default Prop;

