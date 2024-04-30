import * as THREE from 'three'

export var MouseSelectedObj = null;
var lastColor;

export function MouseControl(document, renderer, camera, scene) {
    var raycaster = new THREE.Raycaster();

    function onDocumentMouseDown(event)
    {
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0)
        {
            if (intersects[0].object.name == "grass")
            {
                if (MouseSelectedObj != null)
                {
                    MouseSelectedObj.material.color = lastColor;
                }

                MouseSelectedObj = intersects[0].object;
                lastColor = MouseSelectedObj.material.color;

            }
        }
    }

    document.addEventListener("mousedown", onDocumentMouseDown, false);
}