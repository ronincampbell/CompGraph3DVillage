import * as THREE from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

export async function FbxLoader(building, scene, loadingManager, positionx, positiony, positionz, animatedObjects = null)
{
    const loader = new FBXLoader(loadingManager);
    let object = await loader.loadAsync(building.model)
    let animatedObject = {
        object: object,
        mixer: new THREE.AnimationMixer(),
        speed: building.speed
    } // Declare mixer variable

    object.traverse(function (child) {
        if ((child as THREE.Mesh).isMesh) {
            child.name = building.name;
            //child.castShadow = true;
            child.receiveShadow = true;

            if (building.shadows) {
                child.castShadow = true;
            }

            // Get animations from the object
            const animations = object.animations;

            // If animations exist, play them
            if (animations && animations.length > 0) {  
                // Create an AnimationMixer
                const mixer = new THREE.AnimationMixer(object);
                animatedObject.mixer = mixer;

                const action = mixer.clipAction(animations[0]); // Choose the first animation
                action.play();
            }
        }
    })

    object.scale.set(building.scale, building.scale, building.scale)
    object.position.set(positionx + building.offset.x, positiony + building.offset.y, positionz + building.offset.z);
    scene.add(object);

    if (animatedObjects != null) animatedObjects.push(animatedObject)
    
    return object;
}