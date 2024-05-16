import * as THREE from 'three'

export function Animator(models) {
    for (const model of models) {
        model.mixer.update(model.speed); // Pass the elapsed time since the last frame (deltaTime)
    }
}