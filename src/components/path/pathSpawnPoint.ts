import * as THREE from 'three';
import { PathNode } from '../pathfinding/pathNode';
import { FbxLoader } from '../fbxLoader';

export class PathSpawnPoint 
{
    x: number; y : number;
    left: boolean = false; right: boolean = false; 
    top: boolean = false; bottom: boolean = false;

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
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
            // await FbxLoader("tile", "../../../assets/path/tile.fbx", "../../../assets/path/stone.png", scene, this.x * cellSize, -5, this.y * cellSize, 5);
            await FbxLoader("tile", "../../../assets/path/pathJoin.fbx", "", scene, this.x * cellSize + 32, 0, this.y * cellSize, 0.05);
        }
        else 
        {
            // await FbxLoader("tile", "../../../assets/path/tile.fbx", "../../../assets/path/grass.jpg", scene, this.x * cellSize, -5, this.y * cellSize, 5);
        }
    }
}