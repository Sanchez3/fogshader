/**
 * Created by sanchez 
 */
'use strict';
// import CSS
// import animate_css from 'animate.css/animate.min.css';
import css from '../css/css.css';
// import scss from '../css/sass.scss';



// import Js Plugins/Entities

//ES6 Module
// import Bar1 from './entities/Bar1';
// import Howler from 'howler';
//CommonJS
// var Bar2=require('./entities/Bar2');

// if (!Detector.webgl) Detector.addGetWebGLMessage();
var container, stats;
var camera, scene, renderer;
var shaderMaterial;
var manager;
var noiseTexture, islandJson, mapTexture, catTexture;


function initLoad() {
    manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
        console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    manager.onLoad = function () {
        console.log('Loading complete!');
        loadResCallBack();
    };


    manager.onProgress = function (url, itemsLoaded, itemsTotal) {

        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    };

    manager.onError = function (url) {
        console.log('There was an error loading ' + url);
    };
}

function loadResCallBack() {
    console.log('init');

    var geo = new THREE.PlaneBufferGeometry(40, 40);
    // var uniforms={
    //     iChannel0:  { type: 't', value: THREE.ImageUtils.loadTexture( 'textures/tex07.jpg') }
    // };
    var uniforms = {
        iTime: {
            type: "f",
            value: 1.0
        },
        iResolution: {
            type: "v2",
            value: new THREE.Vector2()
        },
        iChannel0: { type: 't', value: noiseTexture }
    };
    shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById("fogVertexShader").textContent,
        fragmentShader: document.getElementById("fogFragmentShader").textContent
    });
    shaderMaterial.transparent = !0;
    var paper = new THREE.Mesh(geo, shaderMaterial);
    paper.position.set(0, 0, 0);
    scene.add(paper);

    var smaterial = new THREE.SpriteMaterial({
        map: catTexture,
        color: 0xffffff
    });
    var catMesh = new THREE.Sprite(smaterial);
    catMesh.position.set(0, 0, 0);
    catMesh.scale.set(3, 3, 3);
    scene.add(catMesh);
}

function initThree() {

    // CAMERAS

    camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 80;

    // SCENE

    scene = new THREE.Scene();

    // uniform float progress;
    // uniform float burnEffect;

    // uniform float isDepth;
    // uniform float cameraNear;
    // uniform float cameraFar;

    // Textures

    var textureLoader = new THREE.TextureLoader(manager);
    // var jsonLoader = new THREE.JSONLoader(manager);
    noiseTexture = textureLoader.load('/assets/img/noise.png');
    mapTexture = textureLoader.load('/assets/img/color.jpg');
    catTexture = textureLoader.load('/assets/img/cat.png');
    // islandJson = jsonLoader.load('/assets/img/island.json');
    //renderer
    var container = document.getElementById('container');
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
}

function initEvent() {
    document.addEventListener('touchstart', function (e) {}, false);
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, false);
    window.addEventListener('resize', onWindowResize, false);
}

// function initGui() {
//     var gui = new dat.GUI();
//     var folderShaderMaterial = gui.addFolder('ShaderMaterial');
//     var burnTextures = {
//         burningTexture1: burningTexture1,
//         burningTexture2: burningTexture2
//     };
//     folderShaderMaterial.add(params, 'burnTexture', Object.keys(burnTextures)).onChange(function (value) {
//         shaderMaterial.uniforms['burnTex'].value = burnTextures[value];
//     });
//     folderShaderMaterial.add(params, 'burnProgress', 0, 1).step(0.01).onChange(function (value) {
//         shaderMaterial.uniforms['progress'].value = value;

//     });
//     gui.open();
// }

function init() {
    //loadingManager
    initLoad();

    //init Three
    initThree();
    //event
    initEvent();
    //GUI
    // initGui();

    animate();

}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}


window.onload = function () {
    init();

};





function showStats() {
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    var fs = document.createElement('div');
    fs.style.position = 'absolute';
    fs.style.left = 0;
    fs.style.top = 0;
    fs.style.zIndex = 999;
    fs.appendChild(stats.domElement);
    document.body.appendChild(fs);

    function animate() {
        stats.begin();
        // monitored code goes here
        stats.end();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
showStats();