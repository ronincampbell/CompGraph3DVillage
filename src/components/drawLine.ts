import * as THREE from "three";
import { PathNode } from "./pathfinding/pathNode";

export function DrawLine(points, scene, color) {
    const material = new THREE.LineBasicMaterial( { color: color } );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const line = new THREE.Line( geometry, material );

    scene.add( line );
}

export function DrawLineFromPathNode(pathNodes : Array<PathNode>, scene) 
{
    const points = pathNodes.map(item => item.GetVector3());
    DrawLine(points, scene, 0xff0000);
}

export function DrawLineFrom2Point(point1 : THREE.Vector3, point2 : THREE.Vector3, scene)
{
    let points = [];
    points.push(point1, point2);
    DrawLine(points, scene, 0x0000ff);
}