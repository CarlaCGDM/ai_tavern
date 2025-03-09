import Prop from "../Prop";


export default function PropsSetup({ propsRef }) {
    return (
        <>
            <Prop
                ref={(el) => (propsRef.current[0] = el)}
                position={[5, 0, 5]}
                description="treasure chest"
                modelUrl="/assets/models/treasureChest.glb"
            />
            <Prop
                ref={(el) => (propsRef.current[1] = el)}
                position={[-5, 0, -5]}
                description="medieval cart"
                modelUrl="/assets/models/medievalCart.glb"
            />
            <Prop
                ref={(el) => (propsRef.current[2] = el)}
                position={[0, 0, 10]}
                description="tabby cat"
                modelUrl="/assets/models/tabbyCat.glb"
            />
        </>
    );
}