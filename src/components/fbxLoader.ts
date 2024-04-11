import * as THREE from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { TextureLoader } from './textureLoader'

export async function FbxLoader(name, path, texPath, scene, positionx, positiony, positionz, scale = 0.01)
{
    const loader = new FBXLoader();
    loader.load(path, function(object) {
        object.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                child.name = name;
                if ((child as THREE.Mesh).material) {
                    var material = new THREE.MeshBasicMaterial();
                    material.color = new THREE.Color(0.7, 0.9, 0.9);
                    
                    if (texPath !== "")
                    {
                        const texture = TextureLoader(texPath);
                        material.map = texture;
                    }
                    
                    child.material = material;
                }
            }
        })
        object.scale.set(scale, scale, scale)
        scene.add(object);
        object.position.set(positionx, positiony, positionz);
    })
}