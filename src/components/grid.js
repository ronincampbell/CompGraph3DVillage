import * as THREE from 'three';
import { DrawLineFrom2Point } from "./drawLine";


export class Grid {
    constructor(width, height, cellSize, scene)
    {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;

        this.gridArr = Array(width).fill(0).map(x => Array(height).fill(0));

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


}