
import * as glm from './gl-matrix/dist/esm/index.js';

import { generateCube, generatePyramid, generatePlane } from './webgl-resources/webgl-helper-functions.js';
import { Shader } from './webgl-resources/shader.js';
import { Global } from './webgl-resources/global.js';
//import Shape from './webgl-resources/shape.js';
import { OBJParser } from './webgl-resources/obj-parser.js';
import { Pacman } from './webgl-resources/pacman.js';
import { PacmanShapeController } from './webgl-resources/pacman-shape-controller.js';
import { PacmanShape } from './webgl-resources/pacman-shape.js';
import { ShadowShader } from './webgl-resources/shadow-shader.js';










const main = async () => {
    const u = undefined; //for selecting default values
    const defaultScale = [1.5,1.5];
    const colorPacman = [1.0,1.0,0.0,1.0];
    const colorPlane = [0.231, 0.361, 0.361, 1.0];
    const colorWall1 = [0.529, 0, 0.529,1.0];
    const colorWall2 = [0.231, 0, 0.231,1.0];
    const colorDebug = [1.0,0.0,0.0,1.0];
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
    const shadowShader = new ShadowShader("shadow");
    const defaultShader = new Shader("phong");
    const parser = new OBJParser();
    const objects = [];
    let selected = -1;

    var pacmanShape = new PacmanShapeController();
    const pacman = new Pacman(global,pacmanShape, objects);


    //manage drawcalls and starting position for pacman shape
    objects.push(pacmanShape);
    objects[0].rotate("x",90);
     //objects[0].rotate("x",180);
    // objects[0].rotate("z",270);

    const drawLabyrinth = async () => {
        //Labyrinth floor
    objects.push(await parser.parseObjectFromFile('./sampleModels/plane.obj',colorPlane));
    objects[1].scale(16.5,12.0);
    objects[1].rotate("x",-45);
    objects[1].translate(u,u,-0.5);


    // //create Labyrinth

    // //Borders
    // let temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);

    // temp.scale(...defaultScale);
    // temp.scale(u,b15);
    // temp.translate(c10,r0);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.scale(u,b15);
    // temp.translate(-c10,r0);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.scale(b21);
    // temp.translate(c0,r7);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.scale(b21);
    // temp.translate(c0,-r7);
    // objects.push(temp);

    // //structure 1
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(-c7,r6);
    // temp.scale(b3);
    // objects.push(temp);

    // //structure 2
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.scale(b3,b3);
    // temp.translate(-c2,r4);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(c0,r5);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(c1,r5);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(c0,r6);
    // objects.push(temp);

    // //structure 3
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(c4,r6);
    // temp.scale(b3);
    // objects.push(temp);

    // //structure 4
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(-c9,r0);
    // temp.scale(u,b7);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(-c8,r2);
    // objects.push(temp);

    // //structure 5
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(-c6,r4);
    // temp.scale(b3);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(-c6,r2);
    // temp.scale(u,b3);
    // objects.push(temp);

    // //structure 6
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(c1,r2);
    // temp.scale(u,b3);
    // objects.push(temp);

    // //structure 7
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(c4,r3);
    // temp.scale(b3,b3);
    // objects.push(temp);

    // //structure 8
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(c7,r2);
    // temp.scale(u,b7);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(c8,r4);
    // temp.scale(u,b3);
    // objects.push(temp);

    // //structure 9
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(-c7,-r3);
    // temp.scale(u,b5);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(-c4,-r5);
    // temp.scale(b5);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(-c6,-r3);
    // temp.scale(u,b3);
    // objects.push(temp);

    // //structure 10
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(-c4,-r0);
    // temp.scale(u,b3);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(-c3,-r1);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(-c2,r1);
    // temp.scale(b3);
    // objects.push(temp);

    // //structure 11
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(c1,-r1);
    // temp.scale(b5);
    // objects.push(temp);


    // //structure 12
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(c5,-r3);
    // temp.scale(b3);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(c7,-r3);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(c5,-r1);
    // temp.scale(u,b3);
    // objects.push(temp);


    // //structure 13
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(c9,-r2);
    // temp.scale(u,b7);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(c8,-r5);
    // objects.push(temp);


    // //structure 14
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(-c9,-r6);
    // objects.push(temp);    

    

    // //structure 15
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(-c1,-r3);
    // temp.scale(b7);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(c0,-r4);
    // objects.push(temp);

    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
    // temp.scale(...defaultScale);
    // temp.translate(c0,-r5);
    // objects.push(temp);

    // //structure 16
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(c4,-r5);
    // temp.scale(b5);
    // objects.push(temp);
    
    // temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
    // temp.scale(...defaultScale);
    // temp.translate(c4,-r6);
    // objects.push(temp);
    }

    await drawLabyrinth();
    


    var canvas = document.querySelector("#c");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }


        await defaultShader.init(gl);
        await shadowShader.init(gl);

        console.log(shadowShader);
        //prepare vertices and faces

        for (let j = 0; j < objects.length; j++) {
            await objects[j].init(gl, defaultShader);
            await objects[j].initShadow(gl, shadowShader);
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
                case 'v':
                    global.toggleShear();
                    break;
            }
        }
    });

    //init Texture
    gl.activeTexture(gl.TEXTURE0);
    const depthTexture = gl.createTexture();
    const depthTextureSize = 2000;
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texImage2D(
        gl.TEXTURE_2D,      // target
        0,                  // mip level
        gl.DEPTH_COMPONENT32F, // internal format
        depthTextureSize,   // width
        depthTextureSize,   // height
        0,                  // border
        gl.DEPTH_COMPONENT, // format
        gl.FLOAT,           // type
        null);              // data
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


    const draw = () => {
        // first draw from the POV of the light
        const lightWorldMatrix = glm.mat4.lookAt(glm.mat4.create(),
            glm.vec3.fromValues(0.0,10.0,10.0),
            glm.vec3.fromValues(0.0,0.0,0.0), 
            glm.vec3.fromValues(0.0,1.0,0.0));

        const lightProjectionMatrix = glm.mat4.create();

        glm.mat4.perspective(
            lightProjectionMatrix,
            ((60 * Math.PI) / 180),//field of view in rad
            1,//aspect 
            0.1,//zNear
            2000.0//zFar
        );

        const viewMatrix = glm.mat4.invert(glm.mat4.create(), lightWorldMatrix);

        const shadowPass = () => {
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            

            //create texture and frame buffer
            

            const depthFramebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,       // target
                gl.DEPTH_ATTACHMENT,  // attachment point
                gl.TEXTURE_2D,        // texture target
                depthTexture,         // texture
                0);

            gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
            gl.viewport(0, 0, depthTextureSize, depthTextureSize);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            gl.useProgram(shadowShader.program);

            gl.uniformMatrix4fv(shadowShader.uLightProjectionMatrix, false, lightProjectionMatrix);
            gl.uniformMatrix4fv(shadowShader.uLightWorldMatrix, false, lightWorldMatrix);

            for (var i = 0; i < objects.length; i++) {
                objects[i].shadowPass(gl, shadowShader);
            }


            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        shadowPass();

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas and set background color
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.CULL_FACE);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(defaultShader.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, depthTexture);
        gl.uniform1i(defaultShader.uShadowMapLocation, 0);
        gl.uniformMatrix4fv(defaultShader.uLightProjectionMatrix, false, lightProjectionMatrix);
        gl.uniformMatrix4fv(defaultShader.uLightWorldMatrix, false, lightWorldMatrix);

        for (var i = 0; i < objects.length; i++) {
            objects[i].draw(gl, defaultShader, global);
        }

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}

main();