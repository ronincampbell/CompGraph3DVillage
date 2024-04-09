import * as THREE from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { TextureLoader } from './textureLoader'

export async function FbxLoader(name, path, texPath, scene, positionx, positiony, positionz)
{
    const loader = new FBXLoader()
    loader.load(path, function(object) {
        object.name = name;
        object.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                
                if ((child as THREE.Mesh).material) {
                    var material = new THREE.MeshBasicMaterial();
                    material.color = new THREE.Color(0.7, 0.9, 0.9);
                    
                    if (texPath != null)
                    {
                        const texture = TextureLoader(texPath);
                        material.map = texture;
                    }
                    
                    child.material = material;
                }
            }
        })
        object.scale.set(.01, .01, .01)
        scene.add(object);
        object.position.set(positionx, positiony, positionz);
    })
}