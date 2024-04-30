import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EnvMapLoader } from "./components/envMapLoader";
import { GlobalLight } from "./components/globalLight";
import { GUI } from "dat.gui";
import { FbxLoader } from "./components/fbxLoader";
import { MouseControl, MouseSelectedObj } from "./components/mouseControl";
import { ColorSetter } from "./components/colorSetter";
import { Grid } from "./components/pathfinding/grid";
import { PathFinding } from "./components/pathfinding/pathFinding";
import { DrawLine, DrawLineFromPathNode } from "./components/drawLine";
import { PathSpawner } from "./components/path/pathSpawner";
import SkyboxLoader from "./components/skyboxLoader";

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
// Create fog
scene.fog = new THREE.Fog(0xffffff, 1, 500);

const dayCycle = {
  enable: false,
  time: 0,
};

// Create Gui
const gui = new GUI();
const lightFolder = gui.addFolder("Light");
lightFolder.add(light, "intensity", 0, 10);
lightFolder.add(light.color, "r", 0, 1);
lightFolder.add(light.color, "g", 0, 1);
lightFolder.add(light.color, "b", 0, 1);
lightFolder.add(light.position, "x", -40, 40).name("sun position");

const dayCycleFolder = gui.addFolder("Day");
dayCycleFolder.add(dayCycle, "enable", false, true);
dayCycleFolder.add(dayCycle, "time", 0, 1);



// Create sky
addSkyGradient();

// List object
const building = {
  house: {
    name: "house",
    model: "../assets/house/house.fbx",
    tex: "",
    scale: 0.04,
    light: "",
    offset: new THREE.Vector3(0,0,0),
  },
  house1: {
    name: "house",
    model: "../assets/house1/house.fbx",
    tex: "../assets/house1/tex.png",
    scale: 0.01,
    light: "",
    offset: new THREE.Vector3(0,0,0),
  },
  house2: {
    name: "house",
    model: "../assets/house2/house.fbx",
    tex: "../assets/house2/normal.png",
    scale: 0.015,
    light: "",
    offset: new THREE.Vector3(0,0,0),
  },
  path: {
    name: "path",
    model: "../assets/path/pathJoin.fbx",
    tex: "../assets/path/stone.png",
    scale: 0.05,
    light: "",
    offset: new THREE.Vector3(32,0,0),
  },
  grass: {
    name: "grass",
    model: "../assets/path/grass.fbx",
    tex: "../assets/path/grass.png",
    scale: 0.05,
    light: "",
    offset: new THREE.Vector3(49,0,0),
  },
};

const HouseControl = {
  type: 0,
  color: new THREE.Color(1, 0, 0),
};
// Change house type when this one changes
var houseLastType = 0;


// Spawn House
let roadCheckPoints = [];
let roadOffset = -10;
let cellSize = 10; let width = 10; let height = 10;

let pathSpawner = new PathSpawner(width, height, cellSize, building);
let grid = new Grid(width, height, cellSize);

var createHouse = { add:async function(){ 
  if (MouseSelectedObj != null && MouseSelectedObj.name == "grass")
  {
    let position = MouseSelectedObj.parent.position.clone().sub(building.grass.offset);
    await FbxLoader(building.house, scene, position.x, position.y, position.z);

    roadCheckPoints.push(new THREE.Vector3(position.x + roadOffset, 0, position.z));
    grid.gridArr[position.x / 10][position.z / 10].DisablePlacing();
    DrawLine(roadCheckPoints, scene);
    // await pathSpawner.SpawnPath(scene);

    if (roadCheckPoints.length > 1)
    {
      let i = roadCheckPoints.length - 2;
      let pathNodes = [];
      let pathFinding = new PathFinding(grid);
  
      pathNodes = pathFinding.FindPath(roadCheckPoints[i].x / 10, roadCheckPoints[i].z / 10, roadCheckPoints[i + 1].x / 10, roadCheckPoints[i + 1].z / 10);
  
      // Set spawner to spawn grid
      pathSpawner.SetSpawnPointFromPathNodes(pathNodes);
      DrawLineFromPathNode(pathNodes, scene);

      await pathSpawner.SpawnPath(scene);
    }
  }
}};

const houseFolder = gui.addFolder("House");
houseFolder.add(HouseControl, "type", 0, 3);
houseFolder.add(HouseControl.color, "r", 0, 1);
houseFolder.add(HouseControl.color, "g", 0, 1);
houseFolder.add(HouseControl.color, "b", 0, 1);
houseFolder.add(createHouse, 'add');

// Create control
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;

// Skybox
// SkyboxLoader(scene);

(async function () {

  await pathSpawner.SpawnGrass(scene);

  renderer.setAnimationLoop(() => {
    controls.update();

    if (dayCycle.enable) {
      light.color.lerpColors(
        new THREE.Color("Red"),
        new THREE.Color("Yellow"),
        dayCycle.time
      );
    }

    if (houseLastType != Math.round(HouseControl.type)) {
      let position = new THREE.Vector3(0, 0, 0);
      if (MouseSelectedObj != null) {
        position = MouseSelectedObj.parent.position;
        scene.remove(MouseSelectedObj.parent);
      }

      houseLastType = Math.round(HouseControl.type);

      switch (houseLastType) {
        case 0:
          FbxLoader(building.house, scene, position.x, position.y, position.z);
          break;
        case 1:
          FbxLoader(building.house1, scene, position.x, position.y, position.z);
          break;
        case 2:
          FbxLoader(building.house2, scene, position.x, position.y, position.z);
          break;
      }
    }

    if (MouseSelectedObj != null) {
      ColorSetter(MouseSelectedObj, HouseControl.color);
    }

    renderer.render(scene, camera);
  });
})();

// MOUSE CONTROL

var mouseControl = MouseControl(document, renderer, camera, scene);

function addSkyGradient() {
  var vertexShader = `
    varying vec3 vWorldPosition;
    void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
  var fragmentShader = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
    }
`;
  var uniforms = {
    topColor: { value: new THREE.Color(0x54ebff) }, // sky
    bottomColor: { value: new THREE.Color(0xffffff) }, // ground
    offset: { value: 33 },
    exponent: { value: 0.6 },
  };
  var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
  var skyMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    side: THREE.BackSide,
  });
  var sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);
}
