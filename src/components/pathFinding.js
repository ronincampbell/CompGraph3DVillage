

class PathNode {

    PathNode(newGrid, newX, newY)
    {
        this.grid = newGrid;
        this.x = newX;
        this.y = newY;
        this.gCost = 0;
        this.hCost = 0;
        this.fCost = 0;
        this.cameFrom = null;
    }
}

export function PathFinding(startPos, endPos, grid) {
    return null;
}