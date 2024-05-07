import * as THREE from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { TextureLoader } from './textureLoader'

export function TextureSetter(object, tex)
{
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            //create a global var to reference later when changing textures
            child;
            //apply texture
            child.material.map = TextureLoader(tex);
            child.material.needsUpdate = true;
        }
    })
}