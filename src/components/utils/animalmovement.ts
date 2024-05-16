
export function Move(models) {
    for (const model of models) {
        model.object.position.z += 1;
        if (model.object.position.z > 200)
        {
            model.object.position.z = -100;
        }
    }

}