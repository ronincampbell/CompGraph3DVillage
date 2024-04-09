import { Grid } from "./grid";

export class PathNode {

    grid: Grid<PathNode>; 
    x: number; y: number; gCost:number; hCost: number; fCost: number; 
    cameFrom: PathNode

    constructor(newGrid, newX, newY)
    {
        this.grid = newGrid;
        this.x = newX;
        this.y = newY;
        this.gCost = 0;
        this.hCost = 0;
        this.fCost = 0;
    }
}