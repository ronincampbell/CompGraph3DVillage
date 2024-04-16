import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import { MapTextureLoader } from "./components/mapTextureLoader";
import { MeshGenerator } from "./components/meshGenerator";
import { EnvMapLoader } from "./components/envMapLoader";
import { GlobalLight } from "./components/globalLight";
import { GUI } from 'dat.gui'
import { FbxLoader } from "./components/fbxLoader";
import { randInt } from "three/src/math/MathUtils";

// Create scene and background
const scene = new THREE.Scene();
scene.background = new THREE.Color("#FFEECC");

// Create camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
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
const light = GlobalLight();
scene.add(light);

const dayCycle = {
  enable: false,
  time: 0,
}


// Create Gui
const gui = new GUI();
const lightFolder = gui.addFolder('Light')
lightFolder.add(light, 'intensity', 0, 10);
lightFolder.add(light.color, 'r', 0, 1);
lightFolder.add(light.color, 'g', 0, 1);
lightFolder.add(light.color, 'b', 0, 1);
lightFolder.add(light.position, 'x', -40, 40).name('sun position');

const dayCycleFolder = gui.addFolder('Day')
dayCycleFolder.add(dayCycle, 'enable', false, true)
dayCycleFolder.add(dayCycle, 'time', 0, 1);


// Create control
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;

(async function () {

  let envmap = EnvMapLoader(renderer);

  let posiblePositionsX = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95];
  let posiblePositionsZ = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95];
  
  // Adding house model
  for (let i = 0; i < 10; i++) {
      if (posiblePositionsX.length === 0 || posiblePositionsZ.length === 0) {
          console.log("No more unique positions available.");
          break;
      }
    
      // pick random index for possible positions x
      let indexX = Math.floor(Math.random() * posiblePositionsX.length);
      // select the position and then remove it from the array
      let x = posiblePositionsX[indexX];
      posiblePositionsX.splice(indexX, 1);
  
      // pick random index for possible positions z
      let indexZ = Math.floor(Math.random() * posiblePositionsZ.length);
      // select the position and then remove it from the array
      let z = posiblePositionsZ[indexZ];
      posiblePositionsZ.splice(indexZ, 1);
  
      await FbxLoader("house", "../assets/CustomModels/NewPath.fbx", "../assets/CustomModels/Textures/PathTexture.png", scene, x, 0, z);
  }
  

  // // Create texture from path
  // let textures = await MapTextureLoader();

  // // Create mesh for each material (these geo are added below)
  // let mesh = MeshGenerator(textures, envmap);
  // scene.add(mesh.stoneMesh, mesh.dirtMesh, mesh.dirt2Mesh, mesh.sandMesh, mesh.grassMesh);


  renderer.setAnimationLoop(() => {
    controls.update();

    if (dayCycle.enable)
    {
      light.color.lerpColors(new THREE.Color('Red'), new THREE.Color('Yellow'), dayCycle.time);
    }
    
    renderer.render(scene, camera);
  });
})();


// MOUSE CONTROL

var raycaster = new THREE.Raycaster();
var selectedObj = null;

function onDocumentMouseDown(event)
{
  var mouse = new THREE.Vector2();
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0)
  {
    if (intersects[0].object.name == "house" && !selectedObj)
    {
      selectedObj = intersects[0].object;
      selectedObj.traverse(function (child) {
        if (child.isMesh) {
            
            if (child.material) {
                var material = new THREE.MeshBasicMaterial();
                material.color = new THREE.Color(1, 0.5, 0.5);

                child.material = material;
            }
          }
        }
      )
    }
  }
}

document.addEventListener("mousedown", onDocumentMouseDown, false);

