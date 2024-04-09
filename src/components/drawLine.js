import * as THREE from "three";
import { BufferGeometry } from "three";

export function DrawLine(points, scene) {
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const line = new THREE.Line( geometry, material );

    scene.add( line );
}

export function DrawLineFrom2Point(point1, point2, scene)
{
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    let points = [];
    points.push(point1, point2);
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const line = new THREE.Line( geometry, material );

    scene.add( line );
}