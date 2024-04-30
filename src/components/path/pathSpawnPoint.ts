import * as THREE from 'three';
import { PathNode } from '../pathfinding/pathNode';
import { FbxLoader } from '../fbxLoader';

export class PathSpawnPoint 
{
    x: number; y : number;
    left: boolean = false; right: boolean = false; 
    top: boolean = false; bottom: boolean = false;
    building: any;

    constructor(x, y, building)
    {
        this.x = x;
        this.y = y;
        this.building = building;
    }

    SetCameFrom(node: PathNode | undefined) : void {
        if (node == undefined) return;

        if (this.x < node.x)
        {
            this.top = true;
        }
        else if (this.x > node.x)
        {
            this.bottom = true;
        }

        if (this.y < node.y)
        {
            this.right = true;
        }
        else if (this.y > node.y)
        {
            this.left = true;
        }
    }

    async SpawnPath(scene, cellSize): Promise<void> 
    {
        if (this.top || this.bottom || this.left || this.right)
        {
            await FbxLoader(this.building.path, scene, this.x * cellSize + 32, 0, this.y * cellSize);
        }
        else 
        {
            await FbxLoader(this.building.grass, scene, this.x * cellSize + 49, 0, this.y * cellSize);
        }
    }
}