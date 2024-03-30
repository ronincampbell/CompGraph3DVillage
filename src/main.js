import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import { TextureLoader } from "./components/textureLoader";
import { meshGenerator } from "./components/meshGenerator";
import { envMapLoader } from "./components/envMapLoader";
import { globalLight } from "./components/globalLight";
import { GUI } from 'dat.gui'

// Create scene and background
const scene = new THREE.Scene();
scene.background = new THREE.Color("#FFEECC");

// Create camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// camera.position.set(20, 20, 20);
camera.position.set(-17, 31, 33);

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
// Enable shadow for lighting
renderer.useLegacyLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Create light
const light = globalLight();
scene.add(light);

// Create Gui
const gui = new GUI();
const lightFolder = gui.addFolder('Light')
lightFolder.add(light, 'intensity', 0, 10);

// Create control
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;

(async function () {

  let envmap = envMapLoader(renderer);

  // Create texture from path
  let textures = await TextureLoader();

  // Create mesh for each material (these geo are added below)
  let mesh = meshGenerator(textures, envmap);
  scene.add(mesh.stoneMesh, mesh.dirtMesh, mesh.dirt2Mesh, mesh.sandMesh, mesh.grassMesh);


  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
})();


