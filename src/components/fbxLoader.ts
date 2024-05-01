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
            if ((child as THREE.Mesh).material) {
                var material = new THREE.MeshPhongMaterial();
                material.color = new THREE.Color(0.7, 0.9, 0.9);
                
                if (building.tex !== "")
                {
                    const texture = TextureLoader(building.tex);
                    material.map = texture;
                }
                
                child.material = material;
            }
        }
    })
    object.scale.set(building.scale, building.scale, building.scale)
    scene.add(object);
    object.position.set(positionx, positiony, positionz);
    return object;
}