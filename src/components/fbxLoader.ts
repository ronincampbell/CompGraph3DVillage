import * as THREE from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { TextureLoader } from './textureLoader'

export function FbxLoader(building, scene, positionx, positiony, positionz)
{
    const loader = new FBXLoader();
    loader.load(building.model, function(object)
    {
        object.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                child.name = building.name;
                //child.castShadow = true;
                child.receiveShadow = true;

                if (building.shadows) {
                    child.castShadow = true;
                }

                /* This isn't being used
                if ((child as THREE.Mesh).material) {
                    const texture = TextureLoader(building.tex);
                    child.material.map = texture;
                }
                */
            }
            // if (child as THREE.DirectionalLight)
            // {
            //     child.intensity = 0.1;
            // }
        })

        object.scale.set(building.scale, building.scale, building.scale)
        object.position.set(positionx + building.offset.x, positiony + building.offset.y, positionz + building.offset.z);
        scene.add(object);
    })

    
}