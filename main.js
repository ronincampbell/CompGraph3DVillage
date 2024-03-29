import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

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
camera.position.set(20, 20, 20);

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

(async function () {
  // Load reflection material
  let pmrem = new THREE.PMREMGenerator(renderer);
  let envmapTexture = await new RGBELoader()
    .setDataType(THREE.FloatType)
    .loadAsync("assets/envmap.hdr");
  envmap = pmrem.fromEquirectangular(envmapTexture).texture;

  for (var i = 0; i < 10; i++)
  {
    for (var j = 0; j < 10; j++)
    {
      makeHex(3, tileToPosition(i, j));
    }
  }

  let hexagonMesh = new THREE.Mesh(
    hexagonGeometries, 
    new THREE.MeshStandardMaterial({
      envMap: envmap,
      flatShading: true,
    })
  )
  
  scene.add(hexagonMesh);

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
})();



// Fix a hexagon into the grid
function tileToPosition(tileX, tileY)
{
  return new THREE.Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);
}


// Create hexagon on position
let hexagonGeometries = new THREE.BoxGeometry(0, 0, 0);

function hexGeometry(height, position) {
    let geo = new THREE.CylinderGeometry(1, 1, height, 6, 1, false);
    geo.translate(position.x, height * 0.5, position.y);

    return geo;
}

function makeHex(height, position) {
    let geo = hexGeometry(height, position);
    hexagonGeometries = BufferGeometryUtils.mergeGeometries([hexagonGeometries, geo]);
}
