import * as THREE from 'three'

export async function MapTextureLoader() {
    let textures = {
        dirt: await new THREE.TextureLoader().loadAsync("assets/dirt.png"),
        dirt2: await new THREE.TextureLoader().loadAsync("assets/dirt2.jpg"),
        grass: await new THREE.TextureLoader().loadAsync("assets/grass.jpg"),
        sand: await new THREE.TextureLoader().loadAsync("assets/sand.jpg"),
        water: await new THREE.TextureLoader().loadAsync("assets/water.jpg"),
        stone: await new THREE.TextureLoader().loadAsync("assets/stone.png"),
    };

    return textures;
}