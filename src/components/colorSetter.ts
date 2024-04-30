import * as THREE from 'three'

export function ColorSetter(obj, color) {

    // obj.material.color = color.clone();
    obj.traverse(function (child) {
        if ((child as THREE.Mesh).isMesh) {
            if ((child as THREE.Mesh).material) {
                child.material.color = color.clone()

            }
        }
    })
}