import { Grid } from "./grid";
import { PathNode } from "./pathNode";

export class PathFinding {
    grid: Grid<PathNode>;
    
    constructor(width, height, scene)
    {
        this.grid = new Grid<PathNode>(width, height, 10, scene);
    }
}