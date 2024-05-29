import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";
import { FbxLoader } from "./components/utils/fbxLoader";
import { MouseControl, MouseSelectedObj, ResetSelectedObject } from "./components/utils/mouseControl";
import { Grid } from "./components/pathfinding/grid";
import { PathFinding } from "./components/pathfinding/pathFinding";
import { PathSpawner } from "./components/path/pathSpawner";

import { WaterControl } from "./components/environment/water";
import { Bird } from "./components/environment/bird";
import { DropDownMenu } from "./components/ui/button";


// Create scene and background
const scene = new THREE.Scene();
scene.background = new THREE.Color("#CCE2FF");

// Colors
var Colors = {
  red: 0xf25346,
  yellow: 0xedeb27,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xF5986E,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
  green: 0x458248,
  purple: 0x551A8B,
  lightgreen: 0x629265,
};

var HouseLights = [];

// Create camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(120, 50, 120);

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
// Enable shadow for lighting
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

var supportsDepthTextureExtension = !!renderer.extensions.get(
  "WEBGL_depth_texture"
);

var pixelRatio = renderer.getPixelRatio();

var renderTarget = new THREE.WebGLRenderTarget(
  window.innerWidth * pixelRatio,
  window.innerHeight * pixelRatio
);
renderTarget.texture.minFilter = THREE.NearestFilter;
renderTarget.texture.magFilter = THREE.NearestFilter;
renderTarget.texture.generateMipmaps = false;
renderTarget.stencilBuffer = false;

if (supportsDepthTextureExtension === true) {
  renderTarget.depthTexture = new THREE.DepthTexture();
  renderTarget.depthTexture.type = THREE.UnsignedShortType;
  renderTarget.depthTexture.minFilter = THREE.NearestFilter;
  renderTarget.depthTexture.maxFilter = THREE.NearestFilter;
}


var depthMaterial = new THREE.MeshDepthMaterial();
depthMaterial.depthPacking = THREE.RGBADepthPacking;
depthMaterial.blending = THREE.NoBlending;

// Create Sky
createSky();

// ####### NEW LIGHTING #######
var hemisphereLight, shadowLight;
createLights(2.9);
function createLights(intensity) {
  if (hemisphereLight != null) {
    scene.remove(hemisphereLight);
    scene.remove(shadowLight);
  }
  // Gradient coloured light - Sky, Ground, Intensity
  hemisphereLight = new THREE.HemisphereLight(0x54ebff, 0x000000, intensity)
  // Parallel rays
  shadowLight = new THREE.DirectionalLight(0xffffff, intensity);

  shadowLight.position.set(0, 350, 350);
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -650;
  shadowLight.shadow.camera.right = 650;
  shadowLight.shadow.camera.top = 650;
  shadowLight.shadow.camera.bottom = -650;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // Shadow map size
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // Add the lights to the scene
  scene.add(hemisphereLight);

  scene.add(shadowLight);
}

// Create fog
scene.fog = new THREE.Fog(0xCCE2FF, 1, 500);

const dayCycle = {
  enable: false,
  time: 0,
};

// Create sky
//addSkyGradient();

// ####### NEW SKY AND CLOUDS #######
// Addapted from https://codepen.io/Zultan/pen/mwGZBP?editors=0010

// Spawn sky
var sky;
function createSky() {
  sky = new Sky();
  sky.mesh.position.y = 150;
  scene.add(sky.mesh);
}

function Cloud() {
  // Create an empty container for the cloud
  this.mesh = new THREE.Object3D();
  // Cube geometry and material
  var geom = new THREE.DodecahedronGeometry(20, 0);
  var mat = new THREE.MeshPhongMaterial({
    color: Colors.white,
    // make translucent
    transparent: true,
    opacity: 0.7,
  });

  var nBlocs = 3 + Math.floor(Math.random() * 3);

  for (var i = 0; i < nBlocs; i++) {
    //Clone mesh geometry
    var m = new THREE.Mesh(geom, mat);
    //Randomly position each cube
    m.position.x = Math.random() * 100 - 50;
    m.position.y = Math.random() * 10;
    m.position.z = Math.random() * 100 - 50;
    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;

    //Randomly scale the cubes
    var s = 0.1 + Math.random() * 0.9;
    m.scale.set(s, s, s);
    this.mesh.add(m);
  }
}

function Sky() {
  this.mesh = new THREE.Object3D();

  // Number of cloud groups
  this.nClouds = 25;

  // Create the Clouds
  for (var i = 0; i < this.nClouds; i++) {
    var c = new Cloud();

    // Randomly position each cloud
    c.mesh.position.x = Math.random() * 1000 - 500;
    c.mesh.position.y = Math.random() * 10;
    c.mesh.position.z = Math.random() * 1000 - 500;

    // Randomly rotate each cloud
    c.mesh.rotation.z = Math.random() * Math.PI * 2;
    c.mesh.rotation.y = Math.random() * Math.PI * 2;

    // Randomly scale each cloud
    var s = 1 + Math.random() / 2;
    c.mesh.scale.set(s, s, s);

    this.mesh.add(c.mesh);
  }
}

const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.querySelector('.progress-bar-container');
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = function(url, loaded, total)
{
  progressBarContainer.style.display = 'flex';
}

loadingManager.onProgress = function(url, loaded, total) 
{
  progressBar.value = (loaded/total) * 100;
}

loadingManager.onLoad = function() 
{
  progressBarContainer.style.display = 'none';
}

// List object
const building = {
  house: {
    name: "house",
    model: "../assets/CustomModels/NewHouse.fbx",
    tex: "../assets/CustomModels/Textures/HouseTexture.png",
    scale: 0.04,
    light: "",
    offset: new THREE.Vector3(0, 1, 0),
    shadows: true,
  },
  houseBlue: {
    name: "house",
    model: "../assets/CustomModels/BlueHouse1.fbx",
    tex: "../assets/CustomModels/Textures/BlueHouseTex.png",
    scale: 0.04,
    light: "",
    offset: new THREE.Vector3(0, 1, 0),
    shadows: true,
  },
  houseYellow: {
    name: "house",
    model: "../assets/CustomModels/YellowHouse.fbx",
    tex: "../assets/CustomModels/Textures/YellowHouseTex.png",
    scale: 0.04,
    light: "",
    offset: new THREE.Vector3(0, 1, 0),
    shadows: true,
  },
  houseGreen: {
    name: "house",
    model: "../assets/CustomModels/GreenHouse.fbx",
    tex: "../assets/CustomModels/Textures/GreenHouseTex.png",
    scale: 0.04,
    light: "",
    offset: new THREE.Vector3(0, 1, 0),
    shadows: true,
  },
  path: {
    name: "path",
    model: "../assets/CustomModels/NewPath1.fbx",
    tex: "../assets/CustomModels/Textures/PathTexture.png",
    scale: 0.05,
    light: "",
    offset: new THREE.Vector3(32, 0, 0),
    shadows: false,
  },
  grass: {
    name: "grass",
    model: "../assets/CustomModels/NewGrass1.fbx",
    tex: "../assets/CustomModels/Textures/GrassTexture.png",
    scale: 0.05,
    light: "",
    offset: new THREE.Vector3(49, 0, 0),
    shadows: false,
  },
  tree: {
    name: "tree",
    model: "../assets/CustomModels/Treetile.fbx",
    tex: "../assets/CustomModels/Textures/TreeTex.png",
    scale: 0.05,
    light: "",
    offset: new THREE.Vector3(68.35, 0, 0),
    shadows: true,
  },
};


const WaterParams = 
{
  speed: 1,
  foamColor: 0xffffff,
  waterColor: 0x14c6a5
}
const water = new WaterControl(WaterParams);


const GridControl = 
{
  cellSize: 10,
  width: 10,
  length: 10,
}

const TreeControl = 
{
  maxNum: 10,
  percent: 1,
}

const HouseControl = {
  type: 0,
  color: new THREE.Color(1, 0, 0),
  number: 0,
};

const bird = new Bird();
const BirdControl = 
{
  isMoving: false,
  number: 0,
  animationSpeed: 0.5,
  flySpeed: 0.5,
}
// Change house type when this one changes
var houseLastType = 0;

// Spawn House
let roadCheckPoints = [];
let roadOffset = -10;

let pathSpawner = null;
let grid = null;

var methods = {
  spawnGrid: async function() 
  {
    if (pathSpawner != null)
    {
      pathSpawner.Clear(scene);
    }

    pathSpawner = new PathSpawner(GridControl.width, GridControl.length, GridControl.cellSize, building);
    grid = new Grid(GridControl.width, GridControl.length, GridControl.cellSize);
    await pathSpawner.SpawnGrass(scene, loadingManager);
  },

  spawnTree: async function()
  {
    if (pathSpawner == null) return;

    pathSpawner.ClearWithName(scene, "Tree");
    await pathSpawner.SpawnGrass(scene, loadingManager);
    await pathSpawner.SpawnTree(scene, loadingManager, TreeControl.maxNum, TreeControl.percent);
  },

  spawnBird: async function() 
  {
    await bird.AddAllBirds(scene, loadingManager, BirdControl.number);
  },

  addHouse: async function () {
    if (MouseSelectedObj != null && MouseSelectedObj.name == "grass") {
      // let position = MouseSelectedObj.parent.position.clone().sub(building.grass.offset);
      let position = MouseSelectedObj.position;

      pathSpawner.SpawnSingleHouse(scene, loadingManager, position.x / GridControl.cellSize, position.z / GridControl.cellSize);
      addHouseLight(position.x, position.y, position.z);

      roadCheckPoints.push(new THREE.Vector3(position.x, 0, position.z - roadOffset));
      grid.gridArr[position.x / GridControl.cellSize][position.z / GridControl.cellSize].DisablePlacing();

      if (roadCheckPoints.length > 1) {
        let i = roadCheckPoints.length - 2;
        let pathNodes = [];
        let pathFinding = new PathFinding(grid);

        pathNodes = pathFinding.FindPath(roadCheckPoints[i].x / GridControl.cellSize, roadCheckPoints[i].z / GridControl.cellSize, roadCheckPoints[i + 1].x / GridControl.cellSize, roadCheckPoints[i + 1].z / GridControl.cellSize);

        // Set spawner to spawn grid
        pathSpawner.SetSpawnPointFromPathNodes(pathNodes);

        await pathSpawner.SpawnPath(scene, loadingManager);
      }
    }
  },

  addTree: async function()
  {
    if (MouseSelectedObj != null && MouseSelectedObj.name == "grass") {
      let position = MouseSelectedObj.position;

      pathSpawner.SpawnSingleTree(scene, loadingManager, position.x / GridControl.cellSize, position.z / GridControl.cellSize);
    }
  },

  addBird: async function() 
  {
    await bird.AddBird(scene, loadingManager);
  },

  addWater: function()
  {
    if (MouseSelectedObj != null && MouseSelectedObj.name == "grass") {
      let position = MouseSelectedObj.position;

      pathSpawner.SpawnSingleWater(scene, camera, renderTarget, pixelRatio, supportsDepthTextureExtension, water, position.x / GridControl.cellSize, position.z / GridControl.cellSize);

      grid.gridArr[position.x / GridControl.cellSize][position.z / GridControl.cellSize].DisablePlacing();

      
    }
    
  }
};

let menu = new DropDownMenu()
menu.addAction1(methods.addHouse)
menu.addAction2(methods.addTree)
menu.addAction3(methods.addBird)

// ###### FIREFLIES SHADER ######
const ffGeometry = new THREE.BufferGeometry();
const ffCount = 500;
const ffPositions = new Float32Array(ffCount * 3);

for (let i = 0; i < ffCount * 3; i++) {
  ffPositions[i] = Math.random() * 100 + 5;
}

ffGeometry.setAttribute("position", new THREE.BufferAttribute(ffPositions, 3));

const ffSizes = new Float32Array(ffCount);
for (let i = 0; i < ffCount; i++) {
  ffSizes[i] = Math.random() * 5 + 1;
}

ffGeometry.setAttribute("size", new THREE.BufferAttribute(ffSizes, 1));

const ffMaterial = new THREE.ShaderMaterial({
  vertexShader: ffVertexShader(),
  fragmentShader: ffFragmentShader(),
  uniforms: {
    time: { value: 0 },
  },
  transparent: true,
  opacity: 0.5,
  depthWrite: false, 
  blending: THREE.AdditiveBlending,
});

const fireflies = new THREE.Points(ffGeometry, ffMaterial);
scene.add(fireflies);
fireflies.visible = false;

function ffVertexShader() {
  return `
      uniform float time;
      attribute float size;
      varying float vOpacity;

      void main() {
          vec3 pos = position;

          // Simulate movement
          pos.y += sin(time + position.x * 10.0) * 0.1;

          // Apply size and position transformations
          gl_PointSize = size * (1.0 + sin(time * 2.0 + length(pos) * 5.0));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

          // Varying opacity for flickering effect
          vOpacity = 0.5 + 0.5 * sin(time * 3.0 + position.x * 20.0);
      }
  `;
}

function ffFragmentShader() {
  return `
      varying float vOpacity;
      void main() {
          gl_FragColor = vec4(1.0, 1.0, 0.6, vOpacity); // Yellowish color
      }
  `;
}

// Create Gui
const gui = new GUI();

const dayFolder = gui.addFolder("Day/Night");
dayFolder.add(dayCycle, "enable").onChange(() => {
  if (dayCycle.enable) {
    scene.background = new THREE.Color("#000D1F"); // Night color
    scene.fog = new THREE.Fog(0x000D1F, 1, 500); // Night fog
    createLights(0.5);
  } else {
    scene.background = new THREE.Color("#CCE2FF"); // Day color
    scene.fog = new THREE.Fog(0xCCE2FF, 1, 500); // Day fog
    createLights(2.9);
  }
});

const gridFolder = gui.addFolder("Grid");
gridFolder.add(GridControl, "cellSize", 10, 100, 10);
gridFolder.add(GridControl, "width", 1, 20, 1);
gridFolder.add(GridControl, "length", 1, 20, 1);
gridFolder.add(methods, "spawnGrid");

const treeFolder = gui.addFolder("Tree");
treeFolder.add(TreeControl, "maxNum", 0, 100);
treeFolder.add(TreeControl, "percent", 0, 1);
treeFolder.add(methods, "spawnTree");

const houseFolder = gui.addFolder("House");
houseFolder.add(HouseControl, "type", 0, 3, 1).onChange(async () => 
{
  if (MouseSelectedObj != null && MouseSelectedObj.name == 'house') {
    let position = MouseSelectedObj.parent.position;
    ResetSelectedObject();

    switch (HouseControl.type) {
      case 0:
        await pathSpawner.ChangeHouse(scene, loadingManager, building.houseBlue, position.x / GridControl.cellSize, position.z / GridControl.cellSize);
        break;
      case 1:
        await pathSpawner.ChangeHouse(scene, loadingManager, building.house, position.x / GridControl.cellSize, position.z / GridControl.cellSize);
        break;
      case 2:
        await pathSpawner.ChangeHouse(scene, loadingManager, building.houseGreen, position.x / GridControl.cellSize, position.z / GridControl.cellSize);
        break;
      case 3:
        await pathSpawner.ChangeHouse(scene, loadingManager, building.houseYellow, position.x / GridControl.cellSize, position.z / GridControl.cellSize);
        break;

    }
  }
});
houseFolder.add(HouseControl, "number", 0, 10);

const birdFolder = gui.addFolder("Bird");
birdFolder.add(BirdControl, "isMoving");
birdFolder.add(BirdControl, "number", 0, 20, 1);
birdFolder.add(BirdControl, "flySpeed", 0, 1, 0.01);
birdFolder.add(BirdControl, "animationSpeed", 0, 1);
birdFolder.add(methods, "spawnBird");

const waterFolder = gui.addFolder("Water");
waterFolder.add(WaterParams, "speed", 0, 5);
waterFolder.addColor(WaterParams, "foamColor");
waterFolder.addColor(WaterParams, "waterColor");
waterFolder.add(methods, "addWater")

// Create control
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;

(async function () {

  renderer.setAnimationLoop(async () => {
    controls.update();

    if (dayCycle.enable) {
      HouseLights.forEach(light => light.intensity = 500); // Night time intensity
      // make fireflies visible
      fireflies.visible = true;
    } else {
      HouseLights.forEach(light => light.intensity = 0); // Day time intensity, turn off lights
      // make fireflies invisible
      fireflies.visible = false;
    }

    if (houseLastType != Math.round(HouseControl.type)) {
      // let position = new THREE.Vector3(0, 0, 0);
      // if (MouseSelectedObj != null && MouseSelectedObj.name == 'house') {

      //   console.log("placed")
      //   position = MouseSelectedObj.parent.position;
      //   scene.remove(MouseSelectedObj.parent);

      //   switch (houseLastType) {
      //     case 0:
      //       pathSpawner.SpawnSingleHouse(scene, loadingManager, position.x / GridControl.cellSize, position.z / GridControl.cellSize);
      //       break;
      //     case 1:
      //       await FbxLoader(building.houseBlue, scene, position.x, position.y, position.z);
      //       break;
      //     case 2:
      //       await FbxLoader(building.houseYellow, scene, position.x, position.y, position.z);
      //       break;
      //     case 3:
      //       await FbxLoader(building.houseGreen, scene, position.x, position.y, position.z);
      //       break;

      //   }
      // }

      // houseLastType = Math.round(HouseControl.type);

    }

    renderer.render(scene, camera);
  });
})();

// ####### HOUSE LIGHT FUNCTIONS #######
function addHouseLight(PosX, PosY, PosZ){
  var lightIntensity = dayCycle.enable ? 500 : 0;
  var light = new THREE.PointLight(0xede387, lightIntensity, 100);
  light.position.set(PosX-2.75, PosY + 4.25, PosZ + 5);
  scene.add(light);
  HouseLights.push(light);
}

//this fucntion is called when the window is resized
var onWindowResize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  var pixelRatio = renderer.getPixelRatio();

  renderTarget.setSize(
    window.innerWidth * pixelRatio,
    window.innerHeight * pixelRatio
  );
  water.material.uniforms.resolution.value.set(
    window.innerWidth * pixelRatio,
    window.innerHeight * pixelRatio
  );
};

//link the resize of the window to the update of the camera
window.addEventListener('resize', onWindowResize, false);

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

let clock = new THREE.Clock();

function animate() {
    let deltaTime = clock.getDelta();
    fireflies.material.uniforms.time.value += deltaTime;
      
    if (BirdControl.isMoving) bird.Update(BirdControl.flySpeed, BirdControl.animationSpeed);
    water.animate(scene, camera, renderer, renderTarget, clock, depthMaterial, WaterParams);
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
