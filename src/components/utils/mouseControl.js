import * as THREE from 'three'

export var MouseSelectedObj = null;
var lastColor = [];

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
            if (intersects[0].object.name != "")
            {
                if (MouseSelectedObj != null)
                {
                    for (var i = 0; i < MouseSelectedObj.material.length; i++)
                    {
                        MouseSelectedObj.material[i].color = lastColor[i]
                    }
                }

                MouseSelectedObj = intersects[0].object;

                lastColor = [];
                for (var i = 0; i < MouseSelectedObj.material.length; i++)
                {
                    lastColor.push(MouseSelectedObj.material[i].color)
                    MouseSelectedObj.material[i].color = new THREE.Color("Black")
                }
                
                
            }
        }
    }

    document.addEventListener("mousedown", onDocumentMouseDown, false);
}