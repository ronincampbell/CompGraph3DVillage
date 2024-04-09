import { Grid } from "./grid";
import { PathNode } from "./pathNode";

export class PathFinding {
    grid: Grid<PathNode>;
    
    constructor(width, height, scene)
    {
        this.grid = new Grid<PathNode>(width, height, 10, scene);
    }

    FindPath (startX, startY, endX, endY) : Array<PathNode> {
        let startNode : PathNode = this.grid.GetGridObject(startX, startY);

        let openList: Array<PathNode> = [startNode];
        let closedList: Array<PathNode>;

        for (var i = 0; i < this.grid.GetWidth(); i++)
        {
            for (var j = 0; j < this.grid.GetHeight(); j++)
            {
                let pathNode : PathNode = this.grid.GetGridObject(i, j);
                pathNode.gCost = Number.MAX_VALUE;
                pathNode.CalculateFCost();
            }
        }

        startNode.gCost = 0;

        let arr = [];
        return arr;
    }
}