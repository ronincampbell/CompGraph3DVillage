import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

const MAX_INTERATION = 15;
const MAX_HEIGHT = 10;
const STONE_HEIGHT = MAX_HEIGHT * 0.8;
const DIRT_HEIGHT = MAX_HEIGHT * 0.7;
const GRASS_HEIGHT = MAX_HEIGHT * 0.5;
const SAND_HEIGHT = MAX_HEIGHT * 0.3;
const DIRT2_HEIGHT = MAX_HEIGHT * 0;

// Create noise generator
const simplex = new SimplexNoise();

// Create hexagon on position
let stoneGeo = new THREE.BoxGeometry(0, 0, 0);
let dirtGeo = new THREE.BoxGeometry(0, 0, 0);
let dirt2Geo = new THREE.BoxGeometry(0, 0, 0);
let sandGeo = new THREE.BoxGeometry(0, 0, 0);
let grassGeo = new THREE.BoxGeometry(0, 0, 0);

export function MeshGenerator(textures, envmap) {
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
  // Create mesh for each material (these geo are added below)
  let mesh = {
    stoneMesh: hexMesh(stoneGeo, textures.stone, envmap),
    grassMesh: hexMesh(grassGeo, textures.grass, envmap),
    dirt2Mesh: hexMesh(dirt2Geo, textures.dirt2, envmap),
    dirtMesh: hexMesh(dirtGeo, textures.dirt, envmap),
    sandMesh: hexMesh(sandGeo, textures.sand, envmap),
  };
  return mesh;
}

// Fix a hexagon into the grid
function tileToPosition(tileX, tileY) {
  return new THREE.Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);
}

// In make hex, a new geometry will be created and merge in following geo
function makeHex(height, position) {
  let geo = hexGeometry(height, position);

  if (height > STONE_HEIGHT) {
    stoneGeo = BufferGeometryUtils.mergeGeometries([geo, stoneGeo]);
  } else if (height > DIRT_HEIGHT) {
    dirtGeo = BufferGeometryUtils.mergeGeometries([geo, dirtGeo]);
  } else if (height > GRASS_HEIGHT) {
    grassGeo = BufferGeometryUtils.mergeGeometries([geo, grassGeo]);
  } else if (height > SAND_HEIGHT) {
    sandGeo = BufferGeometryUtils.mergeGeometries([geo, sandGeo]);
  } else if (height > DIRT2_HEIGHT) {
    dirt2Geo = BufferGeometryUtils.mergeGeometries([geo, dirt2Geo]);
  }
}

function hexGeometry(height, position) {
  let geo = new THREE.CylinderGeometry(1, 1, height, 6, 1, false);
  geo.translate(position.x, height * 0.5, position.y);

  return geo;
}

function hexMesh(geo, map, envmap) {
  let mat = new THREE.MeshPhysicalMaterial({
    envMap: envmap,
    envMapIntensity: 0.135,
    flatShading: true,
    map,
  });

  let mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}
