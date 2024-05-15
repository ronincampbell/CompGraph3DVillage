import * as THREE from "three"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export async function EnvMapLoader(renderer) {

    // Load reflection material
  let pmrem = new THREE.PMREMGenerator(renderer);
  let envmapTexture = await new RGBELoader()
    .setDataType(THREE.FloatType)
    .loadAsync("assets/envmap.hdr");
  return pmrem.fromEquirectangular(envmapTexture).texture;

}