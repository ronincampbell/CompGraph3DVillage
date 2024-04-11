import { PathNode } from "../pathfinding/pathNode";
import { PathSpawnPoint } from "./pathSpawnPoint";

export class PathSpawner 
{
    cellSize: number; width: number; height: number;
    pathSpawnPoints: Array<Array<PathSpawnPoint>>;

    constructor(width, height, cellSize)
    {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;

        let point = new PathSpawnPoint(0, 0);

        this.pathSpawnPoints = Array(width).fill(point).map(x => Array(height).fill(point));

        for (var i = 0; i < width; i++)
        {
            for (var j = 0; j < height; j++)
            {
                this.pathSpawnPoints[i][j] = new PathSpawnPoint(i, j);
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
        console.log(this.pathSpawnPoints[pathNode.x][pathNode.y]);
    }

    async SpawnPath(scene) : Promise<void> 
    {
        for (var i = 0; i < this.width; i++)
        {
            for (var j = 0; j < this.height; j++)
            {
                await this.pathSpawnPoints[i][j].SpawnPath(scene, this.cellSize);
            }
        }
    }
}