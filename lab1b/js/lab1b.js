
import { generateCube, generatePyramid } from './webgl-resources/webgl-helper-functions.js';
import { Shader } from './webgl-resources/shader.js';
import { Global } from './webgl-resources/global.js';
//import Shape from './webgl-resources/shape.js';
import { OBJParser } from './webgl-resources/obj-parser.js';
import { LightSource } from './webgl-resources/lightsource.js';











const main = async () => {
    const u = undefined; //for selecting default values
    const global = new Global();
    const defaultShader = new Shader("gouraud_spec");
    const parser = new OBJParser();
    const light = new LightSource(u,u,10.0);
    const objects = [];
    let selected = -1;
    let beingDragged = false;
    let moveCamera = false;
    let xMouseLast, yMouseLast;
    var moveCameraIndicator = document.getElementById("moveCameraIndicator");
    var objFileButton = document.getElementById("objFileButton");
    var fileSource = document.getElementById("fileSource");

    objects.push(await parser.parseObjectFromFile('./sampleModels/icosphere.obj'));
    objects[0].translate(-3.0,3.0);

    objects.push(await parser.parseObjectFromFile('./sampleModels/sphere.obj'));
    objects[1].translate(u,3.0);

    objects.push(await parser.parseObjectFromFile('./sampleModels/bunny.obj'));
    objects[2].translate(3.0,3.0);

    objects.push(await parser.parseObjectFromFile('./sampleModels/teapot.obj'));
    objects[3].translate(-3.0);

    objects.push(await parser.parseObjectFromFile('./sampleModels/bunny.obj'));

    objects.push(await parser.parseObjectFromFile('./sampleModels/teapot.obj'));
    objects[5].translate(3.0);

    objects.push(await parser.parseObjectFromFile('./sampleModels/sphere.obj'));
    objects[6].translate(-3.0,-3.0);

    objects.push(await parser.parseObjectFromFile('./sampleModels/icosphere.obj'));
    objects[7].translate(u,-3.0);

    objects.push(await parser.parseObjectFromFile('./sampleModels/bunny.obj'));
    objects[8].translate(3.0,-3.0);


    var canvas = document.querySelector("#c");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }



    await defaultShader.init(gl);

    //prepare vertices and faces
    global.initGlobalCoordinateSystem(gl,defaultShader);
    
    for (var i = 0; i < objects.length; i++) {
        objects[i].init(gl, defaultShader);
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
                case 'a':
                    if(selected > 0) {
                        objects[(selected-1)].scale(0.9);
                    } else if(selected == 0) {
                        global.scale(0.9);
                    }
                    break;
                case 'A':
                    if(selected > 0) {
                        objects[(selected-1)].scale(1.1);
                    } else if(selected == 0) {
                        global.scale(1.1);
                    }
                    break;
                case 'b':
                    if(selected > 0) {
                        objects[(selected-1)].scale(u,0.9);
                    } else if(selected == 0) {
                        global.scale(u,0.9);
                    }
                    break;
                case 'B':
                    if(selected > 0) {
                        objects[(selected-1)].scale(u,1.1);
                    } else if(selected == 0) {
                        global.scale(u,1.1);
                    }
                    break;
                case 'c':
                    if(selected > 0) {
                        objects[(selected-1)].scale(u,u,0.9);
                    } else if(selected == 0) {
                        global.scale(u,u,0.9);
                    }
                    break;
                case 'C':
                    if(selected > 0) {
                        objects[(selected-1)].scale(u,u,1.1);
                    } else if(selected == 0) {
                        global.scale(u,u,1.1);
                    }
                    break;
                case 'i':
                    if(selected > 0) {
                        objects[(selected-1)].rotate("x",1);
                    } else if(selected == 0) {
                        global.rotate("x",1);
                    }
                    break;
                case 'k':
                    if(selected > 0) {
                        objects[(selected-1)].rotate("x",-1);
                    } else if(selected == 0) {
                        global.rotate("x",-1);
                    }
                    break;
                case 'o':
                    if(selected > 0) {
                        objects[(selected-1)].rotate("y",1);
                    } else if(selected == 0) {
                        global.rotate("y",1);
                    }
                    break;
                case 'u':
                    if(selected > 0) {
                        objects[(selected-1)].rotate("y",-1);
                    } else if(selected == 0) {
                        global.rotate("y",-1);
                    }
                    break;
                case 'l':
                    if(selected > 0) {
                        objects[(selected-1)].rotate("z",1);
                    } else if(selected == 0) {
                        global.rotate("z",1);
                    }
                    break;
                case 'j':
                    if(selected > 0) {
                        objects[(selected-1)].rotate("z",-1);
                    } else if(selected == 0) {
                        global.rotate("z",-1);
                    }
                    break;
                case 'ArrowRight':
                    if(moveCamera) {
                        global.translateCamera(0.1);
                    } else {
                        if(selected > 0) {
                            objects[(selected-1)].translate(0.1);
                        } else if(selected == 0) {
                            global.translate(0.1);
                        }
                    }
                    break;
                case 'ArrowLeft':
                    if(moveCamera) {
                        global.translateCamera(-0.1);
                    } else {
                        if(selected > 0) {
                            objects[(selected-1)].translate(-0.1);
                        } else if(selected == 0) {
                            global.translate(-0.1);
                        }
                    }
                    break;
                case 'ArrowUp':
                    if(moveCamera) {
                        global.translateCamera(u,0.1);
                    } else {
                        if(selected > 0) {
                            objects[(selected-1)].translate(u,0.1);
                        } else if(selected == 0) {
                            global.translate(u,0.1);
                        }
                    }
                    break;
                case 'ArrowDown':
                    if(moveCamera) {
                        global.translateCamera(u,-0.1);
                    } else {
                        if(selected > 0) {
                            objects[(selected-1)].translate(u,-0.1);
                        } else if(selected == 0) {
                            global.translate(u,-0.1);
                        }
                    }
                    break;
                case ',':
                    if(moveCamera) {
                        global.translateCamera(u,u,0.1);
                    } else {
                        if(selected > 0) {
                            objects[(selected-1)].translate(u,u,0.1);
                        } else if(selected == 0) {
                            global.translate(u,u,0.1);
                        }
                    }
                    break;
                case '.':
                    if(moveCamera) {
                        global.translateCamera(u,u,-0.1);
                    } else {
                        if(selected > 0) {
                            objects[(selected-1)].translate(u,u,-0.1);
                        } else if(selected == 0) {
                            global.translate(u,u,-0.1);
                        }
                    }
                    break;
                case ' ':
                    moveCamera = !moveCamera;
                    moveCameraIndicator.textContent = moveCamera;
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
        

        newShape.init(gl, defaultShader);

        objects[(selected-1)] = newShape;
    });

    const draw = () => {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas and set background color
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.CULL_FACE);

        gl.useProgram(defaultShader.program);
        
        light.set(gl, defaultShader);

        global.applyMatrices(gl,defaultShader);

        if(selected == 0) {
            global.drawGlobalCoordinateSystem(gl,defaultShader);
        }

        for (var i = 0; i < objects.length; i++) {
            objects[i].draw(gl, defaultShader);
            if(selected > 0 && i == (selected-1)) {
                objects[i].drawCoordianteSystem(gl,defaultShader);
            }
        }

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}

main();