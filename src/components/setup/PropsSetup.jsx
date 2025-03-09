import Prop from "../Prop";
import * as THREE from "three";



export default function PropsSetup({ propsRef }) {
    return (
        <>
            <Prop
                ref={(el) => (propsRef.current[0] = el)}
                position={[0.54, 0, -1.10]}
                rotation={[0, 0, 0]} // pass deg rotations
                description="water well"
                modelUrl="/assets/models/island/well.glb"
            />
            <Prop
                ref={(el) => (propsRef.current[1] = el)}
                position={[9.95, 0.1, -10.95]}
                rotation={[0, -166, 0]}
                description="medieval cart"
                modelUrl="/assets/models/island/cart.glb"
            />
            <Prop
                ref={(el) => (propsRef.current[2] = el)}
                position={[-2.12, 0, -11.53]}
                rotation={[0, 6.25, 0]}
                description="lamp post"
                modelUrl="/assets/models/island/lamp.glb"
            />
            <Prop
                ref={(el) => (propsRef.current[3] = el)}
                position={[3.468, 0, -6.44]}
                rotation={[0, 178, 0]}
                description="lamp post"
                modelUrl="/assets/models/island/lamp.glb"
            />
            <Prop
                ref={(el) => (propsRef.current[4] = el)}
                position={[0.25, 0, 3.8]}
                rotation={[0, 95.9, 0]}
                description="lamp post"
                modelUrl="/assets/models/island/lamp.glb"
            />
            <Prop
                ref={(el) => (propsRef.current[5] = el)}
                position={[-9.87, 0, -1.4]}
                rotation={[0, 88.3, 0]}
                description="medieval church"
                modelUrl="/assets/models/island/church.glb"
            />
            <Prop
                ref={(el) => (propsRef.current[6] = el)}
                position={[-6.92, 0, -10.51]}
                rotation={[0, -117, 0]}
                description="food stall"
                modelUrl="/assets/models/island/stall.glb"
            />
            <Prop
                ref={(el) => (propsRef.current[7] = el)}
                position={[10.2, 0, -1.5]}
                rotation={[0, 0, 0]}
                description="medieval tavern"
                modelUrl="/assets/models/island/tavern.glb"
            />
            <Prop
                ref={(el) => (propsRef.current[8] = el)}
                position={[-5.1, 0, 8.51]}
                rotation={[0, 48.9, 0]}
                description="medieval house"
                modelUrl="/assets/models/island/house1.glb"
            />
             <Prop
                ref={(el) => (propsRef.current[9] = el)}
                position={[5.4,0,8.41]}
                rotation={[0, -128, 0]}
                description="medieval house"
                modelUrl="/assets/models/island/house2.glb"
            />
        </>
    );
}