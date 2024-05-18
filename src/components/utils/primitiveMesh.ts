import * as THREE from 'three'

export function Plane(width, height, posx, posy, posz)
{
    const geometry = new THREE.PlaneGeometry( width, height );
    const material = new THREE.MeshBasicMaterial( {color: 0x00FF00, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.name = "grass";
    plane.rotateX(-Math.PI / 2);

    plane.position.set(posx, posy, posz);

    return plane;

}