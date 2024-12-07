import { Shape } from './shape.js';

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
    gl.deleteShader(shader);
    return undefined;
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
    gl.deleteProgram(program);
    return undefined;
}

export function makeProgamFromSources(gl,vertexShaderSource,fragmentShaderSource) {
    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link the two shaders into a program
    return createProgram(gl, vertexShader, fragmentShader);
}

export function generateCube() {
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
        //Surface normals (vertex normals) corresponding to the indexed vertices
        0.0,0.0,1.0,
        -1.0,0.0,0.0,
        0.0,-1.0,0.0,
        0.0,0.0,-1.0,
        -1.0,0.0,0.0,
        0.0,-1.0,0.0,
        0.0,0.0,1.0,
        -1.0,0.0,0.0,
        0.0,1.0,0.0,
        0.0,0.0,-1.0,
        -1.0,0.0,0.0,
        0.0,1.0,0.0,
        0.0,0.0,1.0,
        1.0,0.0,0.0,
        0.0,-1.0,0.0,
        1.0,0.0,0.0,
        0.0,0.0,-1.0,
        0.0,-1.0,0.0,
        0.0,0.0,1.0,
        1.0,0.0,0.0,
        0.0,1.0,0.0,
        1.0,0.0,0.0,
        0.0,0.0,-1.0,
        0.0,1.0,0.0,
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
export function generatePlane() {
    return new Shape([
        //Vertices (centered around 0,0,0)
        -0.5,-0.5,0.0,
        -0.5,0.5,0.0,
        0.5,-0.5,0.0,
        0.5,0.5,0.0,
    ],
    [
        //Surface normals (vertex normals) corresponding to the indexed vertices
        0.0,0.0,1.0,
        0.0,0.0,1.0,
        0.0,0.0,1.0,
        0.0,0.0,1.0,
    ],
    [
        //Colors
        0.231, 0.361, 0.361,1.0,
        0.231, 0.361, 0.361,1.0,
        0.231, 0.361, 0.361,1.0,
        0.231, 0.361, 0.361,1.0,
    ],
    [
        //indices
        //front
        0,3,1,
        0,2,3
        
    ]);
}

export function generatePyramid() {
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
        0.0,0.5,0.0,
        0.0,0.5,0.0,
        0.0,0.5,0.0,
        0.0,0.5,0.0,
    ],
    [
        //Surface normals (vertex normals) corresponding to the indexed vertices
        -0.89442719,0.4472136,0.0,
        0.0,0.4472136,-0.89442719,
        0.0,-1.0,0.0,
        0.0,0.4472136,-0.89442719,
        0.89442719,0.4472136,0.0,
        0.0,-1.0,0.0,
        -0.89442719,0.4472136,0.0,
        0.0,0.4472136,0.89442719,
        0.0,-1.0,0.0,
        0.89442719,0.4472136,0.0,
        0.0,0.4472136,0.89442719,
        0.0,-1.0,0.0,
        -0.89442719,0.4472136,0.0,
        0.0,0.4472136,-0.89442719,
        0.89442719,0.4472136,0.0,
        0.0,0.4472136,0.89442719,
    ],
    [
        //Colors (for ease of orientation different on each side)
        1.0,0.0,0.0,1.0,
        0.0,0.25,0.0,1.0,
        1.0,0.0,1.0,1.0,
        0.0,0.25,0.0,1.0,
        0.0,0.0,1.0,1.0,
        1.0,0.0,1.0,1.0,
        1.0,0.0,0.0,1.0,
        1.0,1.0,0.0,1.0,
        1.0,0.0,1.0,1.0,
        0.0,0.0,1.0,1.0,
        1.0,1.0,0.0,1.0,
        1.0,0.0,1.0,1.0,
        1.0,0.0,0.0,1.0,
        0.0,0.25,0.0,1.0,
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

export const loadTexture = (filePath) => new Promise(resolve => {
    const texture = new Image();
    texture.addEventListener('load', () => resolve(texture));
    texture.src = filePath;
});

/**
 * 
 * @param {Number} currentAngle 
 * @param {Number} targetAngle 
 * 
 * @returns {Number}
 */
export function calculateRotationDegrees(currentAngle,targetAngle) {
    let degrees = currentAngle - targetAngle;
    if(degrees > 180) {
        degrees -= 360;
    } else if (degrees < -180) {
        degrees += 360;
    }

    return degrees;
}