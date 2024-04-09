import * as THREE from 'three'

var index = -1;

export function ColorSetter(obj, color) {
    index++;
    if (index > 0) return;

    obj.traverse(function (child) {
        if (child.isMesh) {

            if (child.material) {
                child.material.color = color
            }
        }
    }
    )
}