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
import { MouseControl, MouseSelectedObj } from "./components/mouseControl";
import { ColorSetter } from "./components/colorSetter";

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


const HouseControl = {
  type: 0,
  color: new THREE.Color(1, 1, 1)
};
// Change house type when this one changes
var houseLastType = 0;

const houseFolder = gui.addFolder('House')
houseFolder.add(HouseControl, 'type', 0, 3);
houseFolder.add(HouseControl.color, 'r', 0, 1);
houseFolder.add(HouseControl.color, 'g', 0, 1);
houseFolder.add(HouseControl.color, 'b', 0, 1);


// Create control
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;


var selectedObj = null;

(async function () {

  let envmap = EnvMapLoader(renderer);

  // Adding house model
  // var houseObj = await FbxLoader("house", "../assets/house.fbx", "../assets/houseTex.png", scene);

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

    if (houseLastType != Math.round(HouseControl.type))
    {
      if (MouseSelectedObj != null)
      {
        scene.remove(MouseSelectedObj.name);
      }

      houseLastType = Math.round(HouseControl.type);

      switch (houseLastType)
      {
        case 1:
          FbxLoader("house", "../assets/house1/house.fbx", "../assets/house1/tex.png", scene);
          break;
        case 2:
          var objPath = "../assets/house2/house.fbx";
          var texPath = "../assets/house2/albedo.png"
          FbxLoader("house", objPath, texPath, scene);
          break;
      }
    }

    if (MouseSelectedObj != null)
    {
      ColorSetter(MouseSelectedObj, HouseControl.color);
    }

    renderer.render(scene, camera);
  });
})();

// MOUSE CONTROL

var mouseControl = MouseControl(document, renderer, camera, scene);

