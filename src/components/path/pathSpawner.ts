import { PathNode } from "../pathfinding/pathNode";
import { PathSpawnPoint } from "./pathSpawnPoint";

export class PathSpawner 
{
    cellSize: number; width: number; height: number;
    building: any;
    pathSpawnPoints: Array<Array<PathSpawnPoint>>;

    constructor(width, height, cellSize, building)
    {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.building = building;

        let point = new PathSpawnPoint(0, 0, building);
        this.pathSpawnPoints = Array(width).fill(point).map(x => Array(height).fill(point));

        for (var i = 0; i < width; i++)
        {
            for (var j = 0; j < height; j++)
            {
                this.pathSpawnPoints[i][j] = new PathSpawnPoint(i, j, building);
            }
        }
    }

    SetSpawnPointFromPathNodes(pathNodes: Array<PathNode>) : void 
    {
        pathNodes.forEach(pathNode => {
            this.SetSpawnPoint(pathNode);
        });
    }

    GetSpawnPointFromNode(pathNode: PathNode) : PathSpawnPoint 
    {
        let x = pathNode.x;
        let y = pathNode.y;
        return this.pathSpawnPoints[x][y];
    }

    SetSpawnPoint(pathNode: PathNode) : void {
        let cameFrom = pathNode.cameFrom;
        if (cameFrom == undefined) return;

        this.pathSpawnPoints[pathNode.x][pathNode.y].SetCameFrom(pathNode.cameFrom);
        this.pathSpawnPoints[cameFrom.x][cameFrom.y].SetCameFrom(pathNode);
    }

    Clear(scene): void 
    {
        for (var i = 0; i < this.width; i++)
        {
            for (var j = 0; j < this.height; j++)
            {
                this.pathSpawnPoints[i][j].Clear(scene);
            }
        }
    }

    ClearWithName(scene, name): void 
    {
        for (var i = 0; i < this.width; i++)
        {
            for (var j = 0; j < this.height; j++)
            {
                this.pathSpawnPoints[i][j].ClearWithName(scene, name);
            }
        }
    }

    ClearObject(scene): void 
    {
        for (var i = 0; i < this.width; i++)
        {
            for (var j = 0; j < this.height; j++)
            {
                this.pathSpawnPoints[i][j].ClearObject(scene);
            }
        }
    }

    async SpawnGrass(scene, loadingManager) : Promise<void> 
    {
        for (var i = 0; i < this.width; i++)
        {
            for (var j = 0; j < this.height; j++)
            {
                await this.pathSpawnPoints[i][j].SpawnGrass(scene, loadingManager, this.cellSize);
            }
        }
    }

    async SpawnTree(scene, loadingManager, maxNum, randomNum) : Promise<void>
    {
        for (var i = 0; i < this.width; i++)
        {
            for (var j = 0; j < this.height; j++)
            {
                if (Math.random() < randomNum)
                {
                    await this.pathSpawnPoints[i][j].SpawnTree(scene, loadingManager, this.cellSize);
                    maxNum--;
                }

                if (maxNum <= 0) return;
            }
        }
    }

    async SpawnSingleTree(scene, loadingManager, i, j) : Promise<void> 
    {
        await this.pathSpawnPoints[i][j].SpawnTree(scene, loadingManager, this.cellSize);
    }

    async SpawnSingleHouse(scene, loadingManager, i, j) : Promise<void> 
    {
        await this.pathSpawnPoints[i][j].SpawnHouse(scene, loadingManager, this.cellSize);
    }

    async SpawnPath(scene, loadingManager) : Promise<void> 
    {
        for (var i = 0; i < this.width; i++)
        {
            for (var j = 0; j < this.height; j++)
            {
                await this.pathSpawnPoints[i][j].SpawnPath(scene, loadingManager, this.cellSize);
            }
        }
    }
}