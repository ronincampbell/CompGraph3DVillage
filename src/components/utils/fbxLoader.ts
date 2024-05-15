import * as THREE from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

export async function FbxLoader(building, scene, loadingManager, positionx, positiony, positionz)
{
    const loader = new FBXLoader(loadingManager);
    let object = await loader.loadAsync(building.model)


    object.traverse(function (child) {
        if ((child as THREE.Mesh).isMesh) {
            child.name = building.name;
            //child.castShadow = true;
            child.receiveShadow = true;

            if (building.shadows) {
                child.castShadow = true;
            }
        }
    })

    object.scale.set(building.scale, building.scale, building.scale)
    object.position.set(positionx + building.offset.x, positiony + building.offset.y, positionz + building.offset.z);
    scene.add(object);
    
    return object;
}