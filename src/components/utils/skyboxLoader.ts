import * as THREE from 'three'

export default function SkyboxLoader(scene)
{
    let skyboxImage = "purplenebula";
    const materialArray = createMaterialArray(skyboxImage);
    let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
    let skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
} 

function createMaterialArray(filename) {
    const skyboxImagepaths = createPathStrings();
    const materialArray = skyboxImagepaths.map(image => {
        let texture = new THREE.TextureLoader().load(image);
    
        return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); // <---
    });
    return materialArray;
}

function createPathStrings() {
    const basePath = "../../assets/skybox/nightskycolor.png";
    const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
    const pathStings = sides.map(side => {
        return basePath;
    });
    
    return pathStings;
}