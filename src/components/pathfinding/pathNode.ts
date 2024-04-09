import { Grid } from "./grid";
import * as THREE from 'three';

export class PathNode {

    grid: Grid; 
    x: number; y: number; gCost:number; hCost: number; fCost: number; 
    cameFrom?: PathNode

    constructor(newGrid, newX, newY)
    {
        this.grid = newGrid;
        this.x = newX;
        this.y = newY;
        this.gCost = 0;
        this.hCost = 0;
        this.fCost = 0;
    }

    GetVector3() : THREE.Vector3 {
        return new THREE.Vector3(this.x * 10, 0, this.y * 10);
    }

    SetNodeCameFrom(node : PathNode)
    {
        this.cameFrom = node;
    }

    CalculateFCost() {
        this.fCost = this.hCost + this.gCost;
    }
}