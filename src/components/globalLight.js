import * as THREE from "three"

export function GlobalLight()
{
    const light = new THREE.PointLight(new THREE.Color('#FFCB8E').convertSRGBToLinear(), 80, 200);
    light.position.set(10, 20, 10);

    light.intensity = 5;
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;

    return light;
}