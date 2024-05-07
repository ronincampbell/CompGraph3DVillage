import * as THREE from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { TextureLoader } from './textureLoader'

export async function FbxLoader(building, scene, positionx, positiony, positionz)
{
    const loader = new FBXLoader();
    const object = await loader.loadAsync(building.model)
    object.traverse(function (child) {
        if ((child as THREE.Mesh).isMesh) {
            child.name = building.name;
            child.castShadow = true;
            child.receiveShadow = true;
            
            if ((child as THREE.Mesh).material) {
                if (building.tex !== "")
                {
                    const texture = TextureLoader(building.tex);
                    child.material.map = texture;
                }
            }
        }
        // if (child as THREE.DirectionalLight)
        // {
        //     child.intensity = 0.1;
        // }
    })

    
    object.scale.set(building.scale, building.scale, building.scale)
    object.position.set(positionx, positiony, positionz);
    scene.add(object);
    return object;
}