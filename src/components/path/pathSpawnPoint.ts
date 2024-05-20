import * as THREE from 'three';
import { PathNode } from '../pathfinding/pathNode';
import { FbxLoader } from '../utils/fbxLoader';
import { Plane } from '../utils/primitiveMesh';

export class PathSpawnPoint 
{
    x: number; y : number;
    left: boolean = false; right: boolean = false; 
    top: boolean = false; bottom: boolean = false;
    building: any;
    spawnObj: any; spawnObjName: string;

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

    async SpawnGrass(scene, loadingManager, cellSize): Promise<void> 
    {
        if (this.top || this.bottom || this.left || this.right) return; 
        if (this.spawnObj != null) return;
        
        this.spawnObj = Plane(cellSize, cellSize, this.x * cellSize, 0, this.y * cellSize)
        this.spawnObjName = "Grass";
        scene.add( this.spawnObj );
        
    }

    CanSpawn(): boolean 
    {
        return this.spawnObjName != "House" && this.spawnObjName != "Path";
    }

    async SpawnTree(scene, loadingManager, cellSize): Promise<void> 
    {
        if (this.top || this.bottom || this.left || this.right) return; 
        if (!this.CanSpawn()) return;

        if (this.spawnObj != null) scene.remove(this.spawnObj);
        
        this.spawnObjName = "Tree";
        this.spawnObj = await FbxLoader(this.building.tree, scene, loadingManager, this.x * cellSize, 0, this.y * cellSize);
    }

    async SpawnHouse(scene, loadingManager, cellSize): Promise<void> 
    {
        if (this.top || this.bottom || this.left || this.right) return; 
        if (this.spawnObj != null) scene.remove(this.spawnObj);
        
        this.spawnObjName = "House";
        this.spawnObj = await FbxLoader(this.building.houseBlue, scene, loadingManager, this.x * cellSize, 0, this.y * cellSize);
    }

    async SpawnPath(scene, loadingManager, cellSize): Promise<void> 
    {
        if (this.top || this.bottom || this.left || this.right)
        {
            if (this.spawnObj != null) scene.remove(this.spawnObj);

            this.spawnObjName = "Path";
            this.spawnObj = await FbxLoader(this.building.path, scene, loadingManager, this.x * cellSize, 0, this.y * cellSize);
        }
    }

    SpawnWater(scene, camera, renderTarget, pixelRatio, supportsDepthTextureExtension, water, cellSize) : void 
    {
        if (this.top || this.bottom || this.left || this.right) return; 
        if (!this.CanSpawn()) return;

        if (this.spawnObj != null) scene.remove(this.spawnObj);

        this.spawnObjName = "Water";
        this.spawnObj = water.AddWater(scene, camera, renderTarget, pixelRatio, supportsDepthTextureExtension, this.x * cellSize, 0, this.y * cellSize);

    }

    Clear(scene) : void
    {
        if (this.spawnObj != null) scene.remove(this.spawnObj);
    }

    ClearWithName(scene, name) : void 
    {
        if (this.spawnObj != null && this.spawnObjName == name)
        {
            scene.remove(this.spawnObj);
            this.spawnObj = null;
        }
    }

    ClearObject(scene) : void 
    {
        if (this.spawnObj != null && this.spawnObjName != "Grass")
        {
            scene.remove(this.spawnObj);
            this.spawnObj = null;
        }
    }
}