import { FbxLoader } from "../utils/fbxLoader";
import * as THREE from 'three'

export class Bird
{
    bird;
    spawnedBirds = [];
    maxNum = 0;

    constructor()
    {
        this.bird = {
            name: "bird",
            model: "../assets/bird/bird.fbx",
            tex: "../assets/bird/tex.jpeg",
            scale: 1,
            light: "",
            offset: new THREE.Vector3(0, 30, 0),
            shadows: true,
        };
    }

    async AddAllBirds(scene, loadingManager, maxNum)
    {
        this.RemoveAllBirds(scene);
        this.maxNum = maxNum;
        for (var i = 0; i < maxNum; i++)
        {
            await this.AddBird(scene, loadingManager);
        }
    }

    async AddBird(scene, loadingManager)
    {
        await FbxLoader(this.bird, scene, loadingManager, Math.random() * 100 - 30, Math.random() * 30, Math.random() * 100 - 30, this.spawnedBirds);
    }

    RemoveAllBirds(scene)
    {
        if (this.maxNum <= 0) return;
        for (const bird of this.spawnedBirds) {
            scene.remove(bird.object)
        }
        this.spawnedBirds = []
        this.maxNum = 0;
    }

    Update(moveSpeed, animationSpeed)
    {
        if (this.maxNum == 0) return;

        for (const bird of this.spawnedBirds) {
            bird.object.position.z += moveSpeed;
            if (bird.object.position.z > 200)
            {
                bird.object.position.z = -100;
            }
            
            bird.mixer.update(animationSpeed); // Pass the elapsed time since the last frame (deltaTime)
        }

    }
}