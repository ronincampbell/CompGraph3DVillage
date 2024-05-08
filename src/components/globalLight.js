import * as THREE from "three"

export function GlobalLight()
{
    const light = new THREE.PointLight(new THREE.Color('#FFFFFF'), 1);
    light.position.set(10, 20, 10);
    // const light = new THREE.DirectionalLight( 0xffffff, 1 );
    // light.position.set(0, 10, 0);

    light.intensity = 1;
    light.castShadow = true;
    light.shadow.mapSize.width = 4000;
    light.shadow.mapSize.height = 4000;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;

    return light;
}