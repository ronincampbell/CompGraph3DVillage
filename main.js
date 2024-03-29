import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color("#FFEECC")

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 50);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(5, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

scene.add(sphereMesh);

(async function(){
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    })
})();

