import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";

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
document.body.appendChild(renderer.domElement);

// Create control
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;

let envmap;

// Create noise generator
const simplex = new SimplexNoise();

const MAX_INTERATION = 15;
const MAX_HEIGHT = 10;
const STONE_HEIGHT = MAX_HEIGHT * 0.8;
const DIRT_HEIGHT = MAX_HEIGHT * 0.7;
const GRASS_HEIGHT = MAX_HEIGHT * 0.5;
const SAND_HEIGHT = MAX_HEIGHT * 0.3;
const DIRT2_HEIGHT = MAX_HEIGHT * 0;

(async function () {
  // Load reflection material
  let pmrem = new THREE.PMREMGenerator(renderer);
  let envmapTexture = await new RGBELoader()
    .setDataType(THREE.FloatType)
    .loadAsync("assets/envmap.hdr");
  envmap = pmrem.fromEquirectangular(envmapTexture).texture;

  let textures = {
    dirt: await new THREE.TextureLoader().loadAsync("assets/dirt.png"),
    dirt2: await new THREE.TextureLoader().loadAsync("assets/dirt2.jpg"),
    grass: await new THREE.TextureLoader().loadAsync("assets/grass.jpg"),
    sand: await new THREE.TextureLoader().loadAsync("assets/sand.jpg"),
    water: await new THREE.TextureLoader().loadAsync("assets/water.jpg"),
    stone: await new THREE.TextureLoader().loadAsync("assets/stone.png"),
  };

  createGrid();

  let stoneMesh = hexMesh(stoneGeo, textures.stone);
  let grassMesh = hexMesh(grassGeo, textures.grass);
  let dirt2Mesh = hexMesh(dirt2Geo, textures.dirt2);
  let dirtMesh = hexMesh(dirtGeo, textures.dirt);
  let sandMesh = hexMesh(sandGeo, textures.sand);
  scene.add(stoneMesh, dirtMesh, dirt2Mesh, sandMesh, grassMesh);


  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
})();

function createGrid() {
  for (var i = -MAX_INTERATION; i < MAX_INTERATION; i++) {
    for (var j = -MAX_INTERATION; j < MAX_INTERATION; j++) {
      let position = tileToPosition(i, j);

      // Make a cirlce of hexagon
      if (position.length() > 16) continue;

      // Create noise to random hexagon height
      let noise = (simplex.noise(i * 0.1, j * 0.1) + 1) * 0.5;
      noise = Math.pow(noise, 1.5);

      makeHex(noise * MAX_HEIGHT, position);
    }
  }
}

// Fix a hexagon into the grid
function tileToPosition(tileX, tileY) {
  return new THREE.Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);
}

// Create hexagon on position
let stoneGeo = new THREE.BoxGeometry(0, 0, 0);
let dirtGeo = new THREE.BoxGeometry(0, 0, 0);
let dirt2Geo = new THREE.BoxGeometry(0, 0, 0);
let sandGeo = new THREE.BoxGeometry(0, 0, 0);
let grassGeo = new THREE.BoxGeometry(0, 0, 0);

function hexGeometry(height, position) {
  let geo = new THREE.CylinderGeometry(1, 1, height, 6, 1, false);
  geo.translate(position.x, height * 0.5, position.y);

  return geo;
}

function makeHex(height, position) {
  let geo = hexGeometry(height, position);

  if (height > STONE_HEIGHT)
  {
    stoneGeo = BufferGeometryUtils.mergeGeometries([geo, stoneGeo]);
  }
  else if (height > DIRT_HEIGHT)
  {
    dirtGeo = BufferGeometryUtils.mergeGeometries([geo, dirtGeo]);
  }
  else if (height > GRASS_HEIGHT)
  {
    grassGeo = BufferGeometryUtils.mergeGeometries([geo, grassGeo]);
  }
  else if (height > SAND_HEIGHT)
  {
    sandGeo = BufferGeometryUtils.mergeGeometries([geo, sandGeo]);
  }
  else if (height > DIRT2_HEIGHT)
  {
    dirt2Geo = BufferGeometryUtils.mergeGeometries([geo, dirt2Geo]);
  }
}

function hexMesh(geo, map) {
  let mat = new THREE.MeshPhysicalMaterial({
    envMap: envmap,
    envMapIntensity: 1,
    flatShading: true,
    map,
  });

  let mesh = new THREE.Mesh(geo, mat);
  return mesh;
}
