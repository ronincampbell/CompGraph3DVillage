import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector'
import waterShaderFrag from "../../shaders/waterShaderFrag.glsl?raw"
import waterShaderVert from "../../shaders/waterShaderVert.glsl?raw"

export class Water
{
    waters = [];

    mirrorShaderVar = {
        waveSpeed: 0.03,
        waveStrength: 0.5,
        color: "#000000"
    }

    waveShaderVar = {
        uBigWavesElevation: .60,
        uBigWavesFrequency: new THREE.Vector2(.2, .2),
        uBigWavesSpeed: 0.75,
        uDepthColor: '#889999',
        uSurfaceColor: '#9bd8ff',
        uColorOffset: 0.08,
        uColorMultiplier: .1 ,
    }

    AddWater(scene, position)
    {
        let geometry = new THREE.PlaneGeometry(10, 10, 512, 512);  
        let customShader = Reflector.ReflectorShader;
        
        customShader = {

            name: 'ReflectorShader',
        
            uniforms: {
        
            'color': {
                value: this.mirrorShaderVar.color
            },
        
            'tDiffuse': {
                value: null
            },
        
            'textureMatrix': {
                value: null
            },
            
            'waveSpeed': {
                value: this.mirrorShaderVar.waveSpeed
            },

            'waveStrength' : {
                value: this.mirrorShaderVar.waveStrength
            },
            uTime: { value: 0 },
            uBigWavesElevation: { value: .60 },
            uBigWavesFrequency: { value: new THREE.Vector2(.2, .6)},
            uBigWavesSpeed: { value: 0.75 },
            uDepthColor: { value: new THREE.Color("#889999")},
            uSurfaceColor: { value: new THREE.Color("#9bd8ff")},
            uColorOffset: { value: 0.08 },
            uColorMultiplier: { value: .1 },

            uSmallWavesElevation: { value: 0.1 },
            uSmallWavesFrequency: { value: .2},
            uSmallWavesSpeed: { value: 0.2 },
            uSmallWavesIterations: { value: 2.0 },
            },
        
            vertexShader: waterShaderVert,
            fragmentShader: waterShaderFrag,
        };

        const dudvMap = new THREE.TextureLoader().load('../assets/water/waterdudv.jpg');
        dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
        customShader.uniforms.tDudv = {value: dudvMap}
        customShader.uniforms.time = {value: 0}
        
        let water = new Reflector(geometry, {
            shader: customShader,
            clipBias: 0.003,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: new THREE.Color("#889999")
        })
        water.position.set(position.x, position.y, position.z);
        water.rotateX(-Math.PI / 2)
        scene.add(water);

        this.waters.push(water);
    }

}