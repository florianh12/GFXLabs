
import { generateCube, generatePyramid, generatePlane } from './webgl-resources/webgl-helper-functions.js';
import { Shader } from './webgl-resources/shader.js';
import { Global } from './webgl-resources/global.js';
//import Shape from './webgl-resources/shape.js';
import { OBJParser } from './webgl-resources/obj-parser.js';
import { Pacman } from './webgl-resources/pacman.js';










const main = async () => {
    const u = undefined; //for selecting default values
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

    var pacmanShape = await parser.parseObjectFromFile('./sampleModels/pacmanAnimation/pacman_chomp1.obj',[1.0,1.0,0.0,1.0]);
    const pacman = new Pacman(global,pacmanShape);


    objects.push(pacmanShape);
    objects[0].rotate("x",90);
    objects[0].rotate("y",90);
    

    objects.push(generatePlane());
    objects[1].scale(32.0,24.0);
    objects[1].translate(u,u,-0.5);


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

    //Mouse drag listeners
    canvas.addEventListener('mousedown', function(event) {
        if(moveCamera) {
            beingDragged = true;
            //transform browser coordinates to 0-1 coordiante system
            xMouseLast = (event.clientX - canvas.offsetLeft) / canvas.clientWidth;
            yMouseLast = (event.clientY - canvas.offsetTop) / canvas.clientHeight;
        }
    });

    canvas.addEventListener('mousemove', function(event) {
        if(moveCamera && beingDragged) {
            //calculate vector after normalizing coordinates
            const movementX = (event.clientX - canvas.offsetLeft) / canvas.clientWidth - xMouseLast;
            const movementY = (event.clientY - canvas.offsetTop) / canvas.clientHeight - yMouseLast;
            
            //apply movement and scale size relative to camera z position
            global.translateCamera(movementX*-global.camera.eye[2],movementY*global.camera.eye[2]);
            
            //update point
            xMouseLast += movementX;
            yMouseLast += movementY;
        }
    });

    //so that even if the mouse gets out of the canvas, the movement is stopped window is used
    window.addEventListener('mouseup', function(event) {
        beingDragged = false;
    });

    //Read in .obj files

    objFileButton.addEventListener('click', function(event) { if(selected > 0) { fileSource.click()}});

    fileSource.addEventListener('change', async function(event) {
        if(selected < 1) {
            return;
        }
        const file = await (event.target.files[0].text());

        const newShape = parser.parseObjectFromString(file);

        switch(selected) {
            case 1:
                newShape.translate(-3.0,3.0);
                break;
            case 2:
                newShape.translate(u,3.0);
                break;
            case 3:
                newShape.translate(3.0,3.0);
                break;
            case 4:
                newShape.translate(-3.0);
                break;
            case 6:
                newShape.translate(3.0);
                break;
            case 7:
                newShape.translate(-3.0,-3.0);
                break;
            case 8:
                newShape.translate(u,-3.0);
                break;
            case 9:
                newShape.translate(3.0,-3.0);
                break;
        }
        
        for (let i = 0; i < shaders.length; i++) {
            newShape.init(gl, shaders[i]);
        }

        objects[(selected-1)] = newShape;
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