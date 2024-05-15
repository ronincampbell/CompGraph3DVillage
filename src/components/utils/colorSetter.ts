import * as THREE from 'three'

export function ColorSetter(obj, color) {
    obj.traverse(function (child) {
        if ((child as THREE.Mesh).isMesh) {
            if ((child as THREE.Mesh).material) {
                child.material.color = color.clone();
                child.material.needsUpdate = true;
            }
        }
    })
}