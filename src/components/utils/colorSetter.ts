import * as THREE from 'three'

let selectedObj = null;
let lastColor = null;

export function SetColorOnSelected(obj, color) {

    if (selectedObj != null)
    {
        SetColor(selectedObj, lastColor);
    }

    SetColor(obj, color);

    selectedObj = obj;
}

function SetColor(obj, color)
{
    obj.traverse(function (child) {
        if ((child as THREE.Mesh).isMesh) {
            if ((child as THREE.Mesh).material) {
                lastColor = child.material.color;
                child.material.color = color.clone();
                child.material.needsUpdate = true;
            }
        }
    })
}