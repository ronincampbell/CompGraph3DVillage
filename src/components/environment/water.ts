import * as THREE from 'three'
import waterVertexShader from '../../shaders/waterShaderVert.glsl?raw'
import waterFragmentShader from '../../shaders/waterShaderFrag.glsl?raw'

export class WaterControl
{
    water = null; boxes = [];
    noiseMap; dudvMap;

    waterUniforms = {
        
    };

    constructor(WaterParams)
    {
        this.waterUniforms = {
            time: {
                value: 0
            },
            threshold: {
                value: 0.01
            },
            tDudv: {
                value: null
            },
            tDepth: {
                value: null
            },
            cameraNear: {
                value: 0
            },
            cameraFar: {
                value: 0
            },
            resolution: {
                value: new THREE.Vector2()
            },
            foamColor: {
                value: new THREE.Color(WaterParams.foamColor),
            },
            waterColor: {
                value: new THREE.Color(WaterParams.waterColor),
            }
        }

        var loader = new THREE.TextureLoader();
        this.noiseMap = loader.load("https://i.imgur.com/gPz7iPX.jpg");
        this.dudvMap = loader.load("https://i.imgur.com/hOIsXiZ.png");
        this.noiseMap.wrapS = this.noiseMap.wrapT = THREE.RepeatWrapping;
        this.noiseMap.minFilter = THREE.NearestFilter;
        this.noiseMap.magFilter = THREE.NearestFilter;
        this.dudvMap.wrapS = this.dudvMap.wrapT = THREE.RepeatWrapping;
    }

    AddWater(scene, camera, renderTarget, pixelRatio, supportsDepthTextureExtension, posx, posy, posz)
    {
        // border

        var boxGeometry = new THREE.BoxGeometry(10, 1, 1);
        var boxMaterial = new THREE.MeshLambertMaterial({ color: 0xea4d10 });

        var box1 = new THREE.Mesh(boxGeometry, boxMaterial); 
        box1.position.set(posx, posy, posz);
        box1.position.z += 4.5;
        scene.add(box1);

        var box2 = new THREE.Mesh(boxGeometry, boxMaterial);
        box2.position.set(posx, posy, posz);
        box2.position.z += -4.5;
        scene.add(box2);

        var box3 = new THREE.Mesh(boxGeometry, boxMaterial);
        box3.position.set(posx, posy, posz);
        box3.position.x += -5;
        box3.rotation.y = Math.PI * 0.5;
        scene.add(box3);

        var box4 = new THREE.Mesh(boxGeometry, boxMaterial);
        box4.position.set(posx, posy, posz);
        box4.position.x += 5;
        box4.rotation.y = Math.PI * 0.5;
        scene.add(box4);

        this.boxes.push(box1, box2, box3, box4);

        var waterGeometry = new THREE.PlaneGeometry(10, 10);
        var waterMaterial = new THREE.ShaderMaterial({
            defines: {
                DEPTH_PACKING: supportsDepthTextureExtension === true ? 0 : 1,
                ORTHOGRAPHIC_CAMERA: 1
            },
            uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib["fog"], this.waterUniforms]),
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader,
            fog: true
        });

        waterMaterial.uniforms.cameraNear.value = camera.near;
        waterMaterial.uniforms.cameraFar.value = camera.far;
        waterMaterial.uniforms.resolution.value.set(
            window.innerWidth * pixelRatio,
            window.innerHeight * pixelRatio
        );
        waterMaterial.uniforms.tDudv.value = this.dudvMap;
        waterMaterial.uniforms.tDepth.value =
            supportsDepthTextureExtension === true
            ? renderTarget.depthTexture
            : renderTarget.texture;

        this.water = new THREE.Mesh(waterGeometry, waterMaterial);
        this.water.rotation.x = -Math.PI * 0.5;
        this.water.position.set(posx, posy, posz);

        scene.add(this.water);
    }

    animate(scene, camera, renderer, renderTarget, clock, depthMaterial, WaterParams)
    {
        if (this.water == null) return;

        // this.water.visible = false; // we don't want the depth of the water
        // scene.overrideMaterial = depthMaterial;

        // renderer.setRenderTarget(renderTarget);
        // renderer.render(scene, camera);
        // renderer.setRenderTarget(null);

        // scene.overrideMaterial = null;
        // this.water.visible = true;
        
        var time = clock.getElapsedTime();
        this.water.material.uniforms.time.value = time * WaterParams.speed;
        // this.water.material.uniforms.threshold.value = this.waterUniforms.threshold;
        this.water.material.uniforms.foamColor.value.set(new THREE.Color(WaterParams.foamColor));
        this.water.material.uniforms.waterColor.value.set(new THREE.Color(WaterParams.waterColor));

        renderer.render(scene, camera);
    }

    Remove(scene) : void 
    {
        if (this.water) {
            scene.remove(this.water);
            this.water = null;
        }
        if (this.boxes.length > 0) 
        {
            this.boxes.forEach((box) => 
            {
                scene.remove(box);
            })
        }
    }
}