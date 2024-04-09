import * as THREE from 'three';
import { DrawLineFrom2Point } from "../drawLine";


export class Grid<T> {
    width: number; height: number; cellSize: number;
    gridArr: Array<Array<T>>;


    constructor(width, height, cellSize, scene)
    {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;

        this.gridArr = Array(width).fill(null).map(x => Array(height).fill(null));

        for (var i = 0; i < width - 1; i++)
        {
            for (var j = 0; j < height - 1; j++)
            {
                let point0 = new THREE.Vector3(i * cellSize, 0, j * cellSize);
                let point1 = new THREE.Vector3((i+1) * cellSize, 0, j * cellSize);
                let point2 = new THREE.Vector3(i * cellSize, 0, (j+1) * cellSize);

                DrawLineFrom2Point(point0, point1, scene);
                DrawLineFrom2Point(point0, point2, scene);
            }
        }
    }

    SetValue(x, y, value) {
        if (x >= 0 && y >=0 && x < this.width && y < this.height)
        {
            this.gridArr[x][y] = value;
        }
    }
}