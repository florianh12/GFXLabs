import * as glm from './gl-matrix/dist/esm/index.js';
import * as webglUtils from './webgl-utils.js';

class Camera {
    //needs to be reset to 0.0,0.0,8.0 and 0.0,0.0,-1
    eye = glm.vec3.fromValues(0.0,0.0,8.0);

    constructor() {
        this.viewMatrix = this.initViewMatrix(this.eye);
    }

    initViewMatrix(eye) {
        const matrix = glm.mat4.create();
        const target = glm.mat4.create();

        glm.vec3.add(target,eye,glm.vec3.fromValues(0.0,0.0,-1.0));
        glm.mat4.lookAt(matrix,eye,target, glm.vec3.fromValues(0.0,1.0,0.0));

        return matrix;
    }

    translate(x,y,z) {
        glm.vec3.add(this.eye,this.eye,glm.vec3.fromValues(x,y,z));

        this.viewMatrix = this.initViewMatrix(this.eye);
    }
}

class Shader {
    filename = 'default';
    program = -1;
    aColorLocation = -1;
    aColorBuffer = -1;
    aPositionLocation = -1;
    aPositionBuffer = -1;
    uViewMatrixLocation = -1;
    uProjectionMatrixLocation = -1;
    uGlobalTransformationMatrixLocation = -1;
    uLocalTransformationMatrixLocation = -1;

    constructor(filename = 'default') {
        this.filename = filename;
    }

    async init(gl) {
        const vertexShaderSource = await fetch(`./shaders/${this.filename}.vert`).then(file => file.text());
        const fragmentShaderSource = await fetch(`./shaders/${this.filename}.frag`).then(file => file.text());
        
        this.program = webglUtils.makeProgamFromSources(gl,vertexShaderSource,fragmentShaderSource);
        
        this.aPositionLocation = gl.getAttribLocation(this.program, 'a_position');

        this.aColorLocation = gl.getAttribLocation(this.program, 'a_color');
        
        this.uViewMatrixLocation = gl.getUniformLocation(this.program, 'u_view_matrix');
        
        this.uProjectionMatrixLocation = gl.getUniformLocation(this.program, 'u_projection_matrix');

        this.uGlobalTransformationMatrixLocation = gl.getUniformLocation(this.program, 'u_global_transformation_matrix');

        this.uLocalTransformationMatrixLocation = gl.getUniformLocation(this.program, 'u_local_transformation_matrix');
    }
}

class Global {
    camera = new Camera();
    projectionMatrix = glm.mat4.create();
    projectionMatrixInitDone = false;
    scalingMatrix = glm.mat4.create();
    rotationMatrix = glm.mat4.create();
    translationMatrix = glm.mat4.create();
    globalTransformationMatrix = glm.mat4.create();

    initProjectionMatrix(clientWidth,clientHeight) {
        glm.mat4.perspective(
            this.projectionMatrix,
            ((60 * Math.PI) / 180),//field of view in rad
            clientWidth / clientHeight,//aspect 
            0.1,//zNear
            2000.0//zFar
        );

        this.projectionMatrixInitDone = true;
    }

    translate(x = 0.0, y = 0.0, z = 0.0){
        //actual translation
        glm.mat4.translate(
            this.translationMatrix,
            this.translationMatrix,
            glm.vec3.fromValues(x,y,z));

        //applys changes
        this.updateGlobalTransformationMatrix();
    }

    rotate(axis,degree) {
        //converts degree to radians for glmatrix
        const rad = (degree * Math.PI) / 180;
        let rotationAxisVector;

        // choose coordnate system vector based on axis parameter
        // default z axis, because that makes the object rotate 
        // along the projection plane
        switch(axis) {
            case "x":
                rotationAxisVector = glm.vec3.fromValues(1.0,0.0,0.0);
                break;
            case "y":
                rotationAxisVector = glm.vec3.fromValues(0.0,1.0,0.0);
                break;
            case "z":
                rotationAxisVector = glm.vec3.fromValues(0.0,0.0,1.0);
                break;
            default:
                rotationAxisVector = glm.vec3.fromValues(0.0,0.0,1.0);
        }

        //apply rotation to matrix
        glm.mat4.rotate(
            this.rotationMatrix,
            this.rotationMatrix,
            rad,
            rotationAxisVector);

        // recalculate matrix passed to shader
        this.updateGlobalTransformationMatrix();
    }

    scale(x = 1.0, y = 1.0, z = 1.0) {
        //update scaling matrix
        glm.mat4.scale(
            this.scalingMatrix,
            this.scalingMatrix,
            glm.vec3.fromValues(x,y,z));

        // recalculate matrix passed to shader
        this.updateGlobalTransformationMatrix();
    }

    updateGlobalTransformationMatrix() {
        //combine rotation and scaling into globalTransformationMatrix
        glm.mat4.multiply(
            this.globalTransformationMatrix,
            this.rotationMatrix,
            this.scalingMatrix
        );

        //adds translation
        glm.mat4.multiply(
            this.globalTransformationMatrix,
            this.translationMatrix,
            this.globalTransformationMatrix
        );
    }

    applyMatrices(gl, shader) {
        gl.uniformMatrix4fv(shader.uViewMatrixLocation, false, this.camera.viewMatrix);
        gl.uniformMatrix4fv(shader.uProjectionMatrixLocation, false, this.projectionMatrix);
        gl.uniformMatrix4fv(shader.uGlobalTransformationMatrixLocation, false, this.globalTransformationMatrix);
    }
    translateCamera(x = 0.0, y = 0.0, z = 0.0) {
        this.camera.translate(x,y,z);
    }
}

class Shape {
    vao = -1;
    vertices = -1;
    colors = -1;
    indices = -1;
    scalingMatrix = -1;
    rotationMatrix = -1;
    translationMatrix = -1;
    modelMatrix = glm.mat4.create();

    constructor(vertices, colors, indices, 
        scalingMatrix = glm.mat4.create(), 
        rotationMatrix = glm.mat4.create(),
        translationMatrix = glm.mat4.create()) {
        this.vertices = vertices;
        this.colors = colors;
        this.indices = indices;
        this.scalingMatrix = scalingMatrix;
        this.rotationMatrix = rotationMatrix;
        this.translationMatrix = translationMatrix;
        
        //applies transformations if any exist
        this.updateModelMatrix();
    }

    init(gl, shader) {
        this.initializeVAO(gl);
        this.bufferVertexData(gl, shader);
        this.bufferColorData(gl, shader);
        this.bufferIndices(gl);
    }

    initializeVAO(gl) {

        this.vao = gl.createVertexArray();
        
        gl.bindVertexArray(this.vao);
    }

    bufferVertexData(gl, shader) {
        const aPositionBuffer = gl.createBuffer();

        gl.enableVertexAttribArray(shader.aPositionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, aPositionBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices),gl.STATIC_DRAW);

        gl.vertexAttribPointer(shader.aPositionLocation,3/*components amount*/,gl.FLOAT,false/*normalize*/,0/*stride*/,0/*offset*/);
    } 

    bufferColorData(gl, shader) {
        const aColorBuffer = gl.createBuffer();

        gl.enableVertexAttribArray(shader.aColorLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, aColorBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors),gl.STATIC_DRAW);

        gl.vertexAttribPointer(shader.aColorLocation,4/*components amount*/,gl.FLOAT,false/*normalize*/,0/*stride*/,0/*offset*/);
    }

    bufferIndices(gl) {
        const indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    updateModelMatrix() {
        //combine rotation and scaling into model matrix
        glm.mat4.multiply(
            this.modelMatrix,
            this.rotationMatrix,
            this.scalingMatrix
        );

        //adds translation
        glm.mat4.multiply(
            this.modelMatrix,
            this.translationMatrix,
            this.modelMatrix
        );
    }

    translate(x = 0.0, y = 0.0, z = 0.0){
        //actual translation
        glm.mat4.translate(
            this.translationMatrix,
            this.translationMatrix,
            glm.vec3.fromValues(x,y,z));

        //applys changes
        this.updateModelMatrix();
    }

    rotate(axis,degree) {
        //converts degree to radians for glmatrix
        const rad = (degree * Math.PI) / 180;
        let rotationAxisVector;

        // choose coordnate system vector based on axis parameter
        // default z axis, because that makes the object rotate 
        // along the projection plane
        switch(axis) {
            case "x":
                rotationAxisVector = glm.vec3.fromValues(1.0,0.0,0.0);
                break;
            case "y":
                rotationAxisVector = glm.vec3.fromValues(0.0,1.0,0.0);
                break;
            case "z":
                rotationAxisVector = glm.vec3.fromValues(0.0,0.0,1.0);
                break;
            default:
                rotationAxisVector = glm.vec3.fromValues(0.0,0.0,1.0);
        }

        //apply rotation to matrix
        glm.mat4.rotate(
            this.rotationMatrix,
            this.rotationMatrix,
            rad,
            rotationAxisVector);

        // recalculate matrix passed to shader
        this.updateModelMatrix();
    }

    scale(x = 1.0, y = 1.0, z = 1.0) {
        //update scaling matrix
        glm.mat4.scale(
            this.scalingMatrix,
            this.scalingMatrix,
            glm.vec3.fromValues(x,y,z));

        // recalculate matrix passed to shader
        this.updateModelMatrix();
    }

    draw(gl, shader) {
        gl.uniformMatrix4fv(shader.uLocalTransformationMatrixLocation, false, this.modelMatrix);

        gl.bindVertexArray(this.vao);

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}


const generateCube = () => {
    return new Shape([
        //Vertices (centered around 0,0,0)
        -0.5,-0.5,0.5,
        -0.5,-0.5,0.5,
        -0.5,-0.5,0.5,
        -0.5,-0.5,-0.5,
        -0.5,-0.5,-0.5,
        -0.5,-0.5,-0.5,
        -0.5,0.5,0.5,
        -0.5,0.5,0.5,
        -0.5,0.5,0.5,
        -0.5,0.5,-0.5,
        -0.5,0.5,-0.5,
        -0.5,0.5,-0.5,
        0.5,-0.5,0.5,
        0.5,-0.5,0.5,
        0.5,-0.5,0.5,
        0.5,-0.5,-0.5,
        0.5,-0.5,-0.5,
        0.5,-0.5,-0.5,
        0.5,0.5,0.5,
        0.5,0.5,0.5,
        0.5,0.5,0.5,
        0.5,0.5,-0.5,
        0.5,0.5,-0.5,
        0.5,0.5,-0.5,
    ],
    [
        //Colors (for ease of orientation different on each side)
        1.0,0.0,0.0,1.0,
        1.0,0.0,1.0,1.0,
        1.0,1.0,1.0,1.0,
        0.0,0.0,1.0,1.0,
        1.0,0.0,1.0,1.0,
        1.0,1.0,1.0,1.0,
        1.0,0.0,0.0,1.0,
        1.0,0.0,1.0,1.0,
        1.0,1.0,0.0,1.0,
        0.0,0.0,1.0,1.0,
        1.0,0.0,1.0,1.0,
        1.0,1.0,0.0,1.0,
        1.0,0.0,0.0,1.0,
        0.0,1.0,0.0,1.0,
        1.0,1.0,1.0,1.0,
        0.0,1.0,0.0,1.0,
        0.0,0.0,1.0,1.0,
        1.0,1.0,1.0,1.0,
        1.0,0.0,0.0,1.0,
        0.0,1.0,0.0,1.0,
        1.0,1.0,0.0,1.0,
        0.0,1.0,0.0,1.0,
        0.0,0.0,1.0,1.0,
        1.0,1.0,0.0,1.0,
    ],
    [
        //indices
        //front
        0,18,6,
        0,12,18,
        //right
        13,21,19,
        13,15,21,
        //back
        16,9,22,
        16,3,9,
        //left
        4,7,10,
        4,1,7,
        //top
        8,23,11,
        8,20,23,
        //bottom
        14,5,17,
        14,2,5,
    ]);
}

const generatePyramid = () => {
    return new Shape([
        //Vertices (centered around 0,0,0)
        -0.5,-0.5,-0.5,
        -0.5,-0.5,-0.5,
        -0.5,-0.5,-0.5,
        0.5,-0.5,-0.5,
        0.5,-0.5,-0.5,
        0.5,-0.5,-0.5,
        -0.5,-0.5,0.5,
        -0.5,-0.5,0.5,
        -0.5,-0.5,0.5,
        0.5,-0.5,0.5,
        0.5,-0.5,0.5,
        0.5,-0.5,0.5,
        0,0.5,0,
        0,0.5,0,
        0,0.5,0,
        0,0.5,0,
    ],
    [
        //Colors (for ease of orientation different on each side)
        1.0,0.0,0.0,1.0,
        0.0,1.0,0.0,1.0,
        1.0,0.0,1.0,1.0,
        0.0,1.0,0.0,1.0,
        0.0,0.0,1.0,1.0,
        1.0,0.0,1.0,1.0,
        1.0,0.0,0.0,1.0,
        1.0,1.0,0.0,1.0,
        1.0,0.0,1.0,1.0,
        0.0,0.0,1.0,1.0,
        1.0,1.0,0.0,1.0,
        1.0,0.0,1.0,1.0,
        1.0,0.0,0.0,1.0,
        0.0,1.0,0.0,1.0,
        0.0,0.0,1.0,1.0,
        1.0,1.0,0.0,1.0, 
    ],
    [
        //indices
        //bottom
        8,2,5,
        8,5,11,
        //back
        3,1,13,
        //front
        7,10,15,
        //right
        9,4,14,
        //left
        0,6,12,
    ]);
}
const main = async () => {
    const u = undefined; //for selecting default values
    const global = new Global();
    const defaultShader = new Shader();
    const objects = [];
    let selected = -1;
    let moveCamera = false;
    var moveCameraIndicator = document.getElementById("moveCameraIndicator");

    objects.push(generateCube());
    objects[0].translate(-3.0,3.0);

    objects.push(generateCube());
    objects[1].translate(u,3.0);

    objects.push(generateCube());
    objects[2].translate(3.0,3.0);

    objects.push(generatePyramid());
    objects[3].translate(-3.0);

    objects.push(generatePyramid());

    objects.push(generatePyramid());
    objects[5].translate(3.0);

    objects.push(generateCube());
    objects[6].translate(-3.0,-3.0);

    objects.push(generateCube());
    objects[7].translate(u,-3.0);

    objects.push(generateCube());
    objects[8].translate(3.0,-3.0);


    var canvas = document.querySelector("#c");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }



    await defaultShader.init(gl);
    for (var i = 0; i < objects.length; i++) {
        objects[i].init(gl, defaultShader);
    }
    // cube.init(gl, defaultShader);


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


    //example transformations
    // cube.translate(2.0);
    // cube.scale(u,1.5);
    // cube.scale(u,1.5);
    // cube.translate(u,1.0);
    // cube.rotate("y",45);

   // global.scale(0.5);

    const draw = () => {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas and set background color
        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.CULL_FACE);

        gl.useProgram(defaultShader.program);
        
        global.applyMatrices(gl,defaultShader);
        
        for (var i = 0; i < objects.length; i++) {
            objects[i].draw(gl, defaultShader);
        }

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}

main();