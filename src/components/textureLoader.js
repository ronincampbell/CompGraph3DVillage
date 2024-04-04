import * as THREE from 'three'

export function TextureLoader(path) {
    let texture = new THREE.TextureLoader().load(path);

    return texture;
}