import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import { TextureLoader } from "./components/textureLoader";
import { meshGenerator } from "./components/meshGenerator";
import { envMapLoader } from "./components/envMapLoader";

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
const light = new THREE.PointLight(new THREE.Color('#FFCB8E').convertSRGBToLinear(), 80, 200);
light.position.set(10, 20, 10);

light.intensity = 5;
light.castShadow = true;
light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
scene.add(light);

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


