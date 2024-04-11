import { removeItem } from "../../utils/utils";
import { Grid } from "./grid";
import { PathNode } from "./pathNode";

export class PathFinding {
    grid: Grid;
    openList: Array<PathNode>;
    closedList: Array<PathNode>;

    MOVE_STRAIGHT_COST = 10;
    MOVE_DIAGONAL_COST = Number.MAX_VALUE;
    
    constructor(grid)
    {
        this.grid = grid.Clone();
    }

    Draw(scene) {
        this.grid.Draw(scene);
    }

    FindPath (startX, startY, endX, endY) : Array<PathNode> {

        let startNode : PathNode = this.grid.GetGridObject(startX, startY);
        let endNode : PathNode = this.grid.GetGridObject(endX, endY);

        this.openList = [startNode];
        this.closedList = [];

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
        startNode.hCost = this.CalculateDistanceCost(startNode, endNode);
        startNode.CalculateFCost();

        while (this.openList.length > 0)
        {
            let currentNode : PathNode = this.GetLowestFCostNode(this.openList);
            if (currentNode == endNode)
            {
                // Reached final node
                return this.CalculatePath(endNode);
            }

            removeItem(this.openList, currentNode);
            this.closedList.push(currentNode);

            this.GetNeighborList(currentNode).forEach(neighborNode => {
                if (!neighborNode.CanBePlaced()) return;
                if (this.closedList.indexOf(neighborNode) != -1) return;

                let tentativeGCost : number = currentNode.gCost + this.CalculateDistanceCost(currentNode, neighborNode);
                if (tentativeGCost < neighborNode.gCost) {
                    neighborNode.cameFrom = currentNode;
                    neighborNode.gCost = tentativeGCost;
                    neighborNode.hCost = this.CalculateDistanceCost(neighborNode, endNode);
                    neighborNode.CalculateFCost();

                    if (this.openList.indexOf(neighborNode) == -1)
                    {
                        this.openList.push(neighborNode);
                    }
                }
            });
        }

        // Out of nodes
        return [];
    }

    GetNeighborList (currentNode : PathNode) : Array<PathNode> {
        let neighborList : Array<PathNode> = [];

        if (currentNode.x - 1 >= 0)
        {
            // Left
            neighborList.push(this.GetNode(currentNode.x - 1, currentNode.y));
            // Left Down
            if (currentNode.y - 1 >= 0) neighborList.push(this.GetNode(currentNode.x - 1, currentNode.y - 1));
            // Left Up
            if (currentNode.y + 1 < this.grid.GetHeight()) neighborList.push(this.GetNode(currentNode.x - 1, currentNode.y + 1));
        }
        if (currentNode.x + 1 < this.grid.GetWidth())
        {
            // Right
            neighborList.push(this.GetNode(currentNode.x + 1, currentNode.y));
            // Right Down
            if (currentNode.y - 1 >= 0) neighborList.push(this.GetNode(currentNode.x + 1, currentNode.y - 1));
            // Right up
            if (currentNode.y + 1 < this.grid.GetHeight()) neighborList.push(this.GetNode(currentNode.x + 1, currentNode.y + 1));
        }

        // Down
        if (currentNode.y - 1 >= 0) neighborList.push(this.GetNode(currentNode.x, currentNode.y - 1));

        // Up
        if (currentNode.y + 1 < this.grid.GetHeight()) neighborList.push(this.GetNode(currentNode.x, currentNode.y + 1));
        
        return neighborList;
    }

    GetNode(x, y : number) : PathNode {
        return this.grid.GetGridObject(x, y);
    }

    CalculatePath(endNode : PathNode) : Array<PathNode> {
        let path : Array<PathNode> = []; 
        path.push(endNode);
        let currentNode : PathNode = endNode;
        while (currentNode.cameFrom != null)
        {
            path.push(currentNode.cameFrom);
            currentNode = currentNode.cameFrom;
        } 

        path.reverse();
        return path;
    }

    CalculateDistanceCost(a, b : PathNode) : number {
        let xDistance = Math.abs(a.x - b.x); 
        let yDistance = Math.abs(a.y - b.y);
        let remaining = Math.abs(xDistance - yDistance); 
        return this.MOVE_DIAGONAL_COST * Math.min(xDistance, yDistance) + this.MOVE_STRAIGHT_COST * remaining; 
    }

    GetLowestFCostNode(pathNodeList : Array<PathNode>) : PathNode {
        let lowestFCostNode : PathNode = pathNodeList[0];
        for (var i = 0; i < pathNodeList.length; i++)
        {
            if (!pathNodeList[i].CanBePlaced()) continue;

            if (pathNodeList[i].fCost < lowestFCostNode.fCost)
            {
                lowestFCostNode = pathNodeList[i];
            }
        }

        return lowestFCostNode;
    }

    
}