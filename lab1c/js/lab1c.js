
import { generateCube, generatePyramid, generatePlane } from './webgl-resources/webgl-helper-functions.js';
import { Shader } from './webgl-resources/shader.js';
import { Global } from './webgl-resources/global.js';
//import Shape from './webgl-resources/shape.js';
import { OBJParser } from './webgl-resources/obj-parser.js';
import { Pacman } from './webgl-resources/pacman.js';










const main = async () => {
    const u = undefined; //for selecting default values
    const defaultScale = [1.5,1.5];
    const colorPacman = [1.0,1.0,0.0,1.0];
    const colorPlane = [0.231, 0.361, 0.361, 1.0];
    const colorWall1 = [0.529, 0, 0.529,1.0];
    const colorWall2 = [0.231, 0, 0.231,1.0];
    //additional scaling on per block basis
    const b3 = 3.0;
    const b5 = 5.0;
    const b7 = 7.0;
    const b9 = 9.0;
    const b11 = 11.0;
    const b13 = 13.0;
    const b15 = 15.0;//max vertical
    const b17 = 17.0;
    const b19 = 19.0;
    const b21 = 21.0;
    //rows starting from origin (middle of plane), 
    //negate row values for lower half of plane
    const r0 = 0.0;
    const r1 = 1.5;
    const r2 = 3.0;
    const r3 = 4.5;
    const r4 = 6.0;
    const r5 = 7.5;
    const r6 = 9.0;
    const r7 = 10.5;
    //columns starting from origin (middle of plane),
    //negate column values for left half of plane
    const c0 = 0.0;
    const c1 = 1.5;
    const c2 = 3.0;
    const c3 = 4.5
    const c4 = 6.0;
    const c5 = 7.5;
    const c6 = 9.0;
    const c7 = 10.5;
    const c8 = 12.0;
    const c9 = 13.5;
    const c10 = 15.0;
    const global = new Global();
    let selected_shader = 0;
    const shaders = [new Shader("phong")];
    //const defaultShader = new Shader("gouraud");
    const parser = new OBJParser();
    const objects = [];
    let selected = -1;
    let beingDragged = false;
    let moveCamera = false;
    let moveLight = false;
    let xMouseLast, yMouseLast;
    var moveCameraIndicator = document.getElementById("moveCameraIndicator");
    var moveLightIndicator = document.getElementById("moveLightIndicator");
    var objFileButton = document.getElementById("objFileButton");
    var fileSource = document.getElementById("fileSource");

    var pacmanShape = await parser.parseObjectFromFile('./sampleModels/pacmanAnimation/pacman_chomp1.obj',colorPacman);
    const pacman = new Pacman(global,pacmanShape);

    //manage drawcalls and starting position for pacman shape
    objects.push(pacmanShape);
    objects[0].rotate("x",90);
    objects[0].rotate("y",90);
    
    //Labyrinth floor
    objects.push(await parser.parseObjectFromFile('./sampleModels/plane.obj',colorPlane));
    objects[1].scale(16.5,12.0);
    objects[1].translate(u,u,-0.5);


    //create Labyrinth
    let temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);

    temp.scale(...defaultScale);
    temp.scale(u,b15);
    temp.translate(c10,r0);
    objects.push(temp);

    temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    temp.scale(...defaultScale);
    temp.scale(u,b15);
    temp.translate(-c10,r0);
    objects.push(temp);

    temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    temp.scale(...defaultScale);
    temp.scale(b21);
    temp.translate(c0,r7);
    objects.push(temp);
    temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    temp.scale(...defaultScale);
    temp.scale(b21);
    temp.translate(c0,-r7);
    objects.push(temp);

    temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    temp.scale(...defaultScale);
    temp.scale(b3)
    temp.translate(-c2,r5);
    objects.push(temp);

    temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    temp.scale(...defaultScale);
    temp.translate(c0,r5);
    objects.push(temp);

    temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    temp.scale(...defaultScale);
    temp.translate(c1,r5);
    objects.push(temp);

    temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    temp.scale(...defaultScale);
    temp.translate(c0,r6);
    objects.push(temp);

    temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    temp.scale(...defaultScale);
    temp.translate(-c9,r6)
    objects.push(temp);

    var canvas = document.querySelector("#c");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }


    for (let i = 0; i < shaders.length; i++) {
        await shaders[i].init(gl);

        //prepare vertices and faces
        global.initGlobalCoordinateSystem(gl,shaders[i]);

        for (let j = 0; j < objects.length; j++) {
            objects[j].init(gl, shaders[i]);
        }
    }

    function onResize(entries) {

        for (const entry of entries) {
            if (entry.devicePixelContentBoxSize) {
                canvas.width = entry.devicePixelContentBoxSize[0].inlineSize;
                canvas.height = entry.devicePixelContentBoxSize[0].blockSize;
                
                if(!global.projectionMatrixInitDone) {
                    global.initProjectionMatrix(entry.devicePixelContentBoxSize[0].inlineSize,entry.devicePixelContentBoxSize[0].blockSize);
                }
            }
        }
    }

    //handles zooming
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas, {box: 'device-pixel-content-box'});
    
    //Keyboard input listeners
    document.addEventListener("keydown",function(event) {
        if(!(isNaN(event.key) || isNaN(parseFloat(event.key)))) {
            selected = parseFloat(event.key);
        } else {
            switch(event.key) {
                case 'ArrowRight':
                    pacman.translate(3);
                    break;
                case 'ArrowLeft':
                    pacman.translate(4);
                    break;
                case 'ArrowUp':
                    pacman.translate(1);
                    break;
                case 'ArrowDown':
                    pacman.translate(2);
                    break;
                     
            }
        }
    });


    const draw = () => {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas and set background color
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clearDepth(1.0);
        
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.CULL_FACE);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(shaders[selected_shader].program);
        
        if(selected == 0) {
            global.drawGlobalCoordinateSystem(gl,shaders[selected_shader]);
        }

        for (var i = 0; i < objects.length; i++) {
            objects[i].draw(gl, shaders[selected_shader], global);
            if(selected > 0 && i == (selected-1)) {
                objects[i].drawCoordianteSystem(gl,shaders[selected_shader], global);
            }
        }

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}

main();