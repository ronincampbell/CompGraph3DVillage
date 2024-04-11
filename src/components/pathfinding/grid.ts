import * as THREE from 'three';
import { DrawLineFrom2Point } from "../drawLine";
import { PathNode } from './pathNode';


export class Grid {
    width: number; height: number; cellSize: number;
    gridArr: Array<Array<PathNode>>;
    noDraw?: boolean;


    constructor(width, height, cellSize)
    {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;

        let pathNode = new PathNode(this, 0, 0);

        this.gridArr = Array(width).fill(pathNode).map(x => Array(height).fill(pathNode));

        for (var i = 0; i < width; i++)
        {
            for (var j = 0; j < height; j++)
            {
                this.gridArr[i][j] = new PathNode(this, i, j);
            }
        }
    }

    Clone() : Grid {
        let newGrid = new Grid(this.width, this.height, this.cellSize);

        for (var i = 0; i < this.width; i++)
        {
            for (var j = 0; j < this.height; j++)
            {
                newGrid.gridArr[i][j].canPlace = this.gridArr[i][j].canPlace;
            }
        }

        return newGrid;
    }

    Draw(scene) {
        for (var i = 0; i < this.width - 1; i++)
        {
            for (var j = 0; j < this.height - 1; j++)
            {
                let point0 = new THREE.Vector3(i * this.cellSize, 0, j * this.cellSize);
                let point1 = new THREE.Vector3((i+1) * this.cellSize, 0, j * this.cellSize);
                let point2 = new THREE.Vector3(i * this.cellSize, 0, (j+1) * this.cellSize);

                DrawLineFrom2Point(point0, point1, scene);
                DrawLineFrom2Point(point0, point2, scene);
            }
        }
    }

    SetUnplaceablePathNode(x, y : number) : void {
        if (x >= 0 && y >= 0 && x <= this.width && y <= this.height)
        {
            this.gridArr[x][y].DisablePlacing();
        }
    }   

    GetWidth(): number {
        return this.width;
    }

    GetHeight(): number {
        return this.height;
    }

    GetGridObject(x, y) : PathNode {
        return this.gridArr[x][y];
    }
}