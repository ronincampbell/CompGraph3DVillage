import * as THREE from 'three'

export var MouseSelectedObj = null;

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
            
            if (intersects[0].object.name == "house" && !MouseSelectedObj)
            {
                MouseSelectedObj = intersects[0].object;
            }
        }
    }

    document.addEventListener("mousedown", onDocumentMouseDown, false);
}