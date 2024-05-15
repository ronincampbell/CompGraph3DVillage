import * as THREE from 'three'
import toonVertShader from '../../shaders/toonShaderVert.glsl?raw'
import toonFragShader from '../../shaders/toonShaderFrag.glsl?raw'

export const toonshaderMaterial =  new THREE.ShaderMaterial({
  uniforms: {
    thickness: { value: 100},
    color: {value: new THREE.Color("Black")}
  },
  vertexShader: toonVertShader,
  fragmentShader: toonFragShader,
  side: THREE.BackSide
});

export function ToonMesh (object, scene) 
{

  object.traverse(function (child) {
    if ((child as THREE.Mesh).isMesh) {
      const geometry = child.geometry
      const material = new THREE.ShaderMaterial({
        uniforms: {
          thickness: { value: 100},
          color: {value: new THREE.Color("Black")}
        },
        vertexShader: toonVertShader,
        fragmentShader: toonFragShader,
        side: THREE.BackSide
      })
    
      let outline = new THREE.Mesh(geometry, material);
      scene.add(outline)
      outline.position.set(child.position.x, child.position.y, child.position.z)
    }
})
  
  
  // let outlineObject = 
  // {
  //   mesh: mesh,
  //   outline: outline,
  // }

  // outlineObjects.push(outlineObject)
}
