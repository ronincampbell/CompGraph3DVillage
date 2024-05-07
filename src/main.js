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
import { lerp } from "three/src/math/MathUtils";
import { TextureLoader } from "./components/textureLoader";
// import { TextureSetter } from "./components/textureSetter";

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

// Create sky
addSkyGradient();

// List object
const building = {
  house: {
    name: "house",
    model: "../assets/CustomModels/NewHouse.fbx",
    tex: "../assets/CustomModels/Textures/HouseTexture.png",
    scale: 0.04,
    light: "",
    offset: new THREE.Vector3(0,0,0),
  },
  houseBlue: {
    name: "house",
    model: "../assets/CustomModels/NewHouse.fbx",
    tex: "../assets/CustomModels/Textures/HouseTextureBlue.png",
    scale: 0.04,
    light: "",
    offset: new THREE.Vector3(0,0,0),
  },
  houseYellow: {
    name: "house",
    model: "../assets/CustomModels/NewHouse.fbx",
    tex: "../assets/CustomModels/Textures/HouseTextureYellow.png",
    scale: 0.04,
    light: "",
    offset: new THREE.Vector3(0,0,0),
  },
  houseGreen: {
    name: "house",
    model: "../assets/CustomModels/NewHouse.fbx",
    tex: "../assets/CustomModels/Textures/HouseTextureGreen.png",
    scale: 0.04,
    light: "",
    offset: new THREE.Vector3(0,0,0),
  },
  path: {
    name: "path",
    model: "../assets/CustomModels/NewPath.fbx",
    tex: "../assets/CustomModels/Textures/PathTexture.png",
    scale: 0.05,
    light: "",
    offset: new THREE.Vector3(32,0,0),
  },
  grass: {
    name: "grass",
    model: "../assets/CustomModels/NewGrass.fbx",
    tex: "../assets/CustomModels/Textures/GrassTexture.png",
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
    console.log(position);
    await FbxLoader(building.houseBlue, scene, position.x, position.y, position.z);

    roadCheckPoints.push(new THREE.Vector3(position.x, 0, position.z - roadOffset));
    grid.gridArr[position.x / 10][position.z / 10].DisablePlacing();

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

// Create Gui
const gui = new GUI();

const dayCycleFolder = gui.addFolder("Day");
dayCycleFolder.add(dayCycle, "enable", false, true);
dayCycleFolder.add(dayCycle, "time", 0, 24);
var lightPos1 = new THREE.Vector3(0, 20, 0);
var lightPos2 = new THREE.Vector3(50, 40, 0);
var lightPos3 = new THREE.Vector3(100, 20, 0);
var darkBlue = '#000435';
var orange = '#f8aa27';
var lightIten1 = 1;
var lightIten2 = 5;

const houseFolder = gui.addFolder("House");
houseFolder.add(HouseControl, "type", 0, 3);
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

  renderer.setAnimationLoop(async () => {
    controls.update();

    if (dayCycle.enable) {
      var timePercent = dayCycle.time / 24;
      if (dayCycle.time <= 12)
      {
        var lerpVal = dayCycle.time / 12;
        light.color.lerpColors(
          new THREE.Color(darkBlue),
          new THREE.Color(orange),
          lerpVal
        );
        light.position.lerpVectors(lightPos1, lightPos2, lerpVal);
        light.intensity = lerp(lightIten1, lightIten2, lerpVal);
      }
      else 
      {
        var lerpVal = (dayCycle.time - 12) / 12;
        light.color.lerpColors(
          new THREE.Color(orange),
          new THREE.Color(darkBlue),
          lerpVal
        );
        light.position.lerpVectors(lightPos2, lightPos3, lerpVal);
        light.intensity = lerp(lightIten2, lightIten1, lerpVal);
      }
      light.rotation.set(timePercent * 360 - 90, 170, 0);
      
    }

    if (houseLastType != Math.round(HouseControl.type)) {
      let position = new THREE.Vector3(0, 0, 0);
      if (MouseSelectedObj != null && MouseSelectedObj.name == 'house') {

        console.log("placed")
        position = MouseSelectedObj.parent.position;
        scene.remove(MouseSelectedObj.parent);

        switch (houseLastType) {
          case 0:
            await FbxLoader(building.house, scene, position.x, position.y, position.z);
            break;
          case 1:
            await FbxLoader(building.houseBlue, scene, position.x, position.y, position.z);
            break;
          case 2:
            await FbxLoader(building.houseYellow, scene, position.x, position.y, position.z);
            break;
          case 3:
            await FbxLoader(building.houseGreen, scene, position.x, position.y, position.z);
            break;
          
        }
      }

      houseLastType = Math.round(HouseControl.type);

    }

    if (MouseSelectedObj != null) {
      ColorSetter(MouseSelectedObj.parent, new THREE.Color("Red"));
    }

    renderer.render(scene, camera);
  });
})();

  //this fucntion is called when the window is resized
  var MyResize = function ( )
  {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width,height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.render(scene,camera);
  };

  //link the resize of the window to the update of the camera
  window.addEventListener( 'resize', MyResize);

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

function TextureSetter(object, tex)
{
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            //create a global var to reference later when changing textures
            child;
            //apply texture
            child.material.map = TextureLoader(tex);
            child.material.needsUpdate = true;
        }
    })

    return object;
}