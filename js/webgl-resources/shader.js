import * as webglUtils from './webgl-helper-functions.js';

export class Shader {
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