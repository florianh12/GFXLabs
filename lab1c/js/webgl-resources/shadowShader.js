import * as webglUtils from './webgl-helper-functions.js';

export class ShadowShader {
    filename = 'shadow';
    program = -2;
    aPositionLocation = -2;
    uViewMatrixLocation = -2;
    uProjectionMatrixLocation = -2;
    uViewMatrixLocation = -2;
    uModelMatrixLocation = -2;
    uLightPosLocation = -2;

    constructor(filename = 'shadow') {
        this.filename = filename;
    }

    async init(gl) {
        const vertexShaderSource = await fetch(`./shaders/${this.filename}.vert`).then(file => file.text());
        const fragmentShaderSource = await fetch(`./shaders/${this.filename}.frag`).then(file => file.text());
        
        this.program = webglUtils.makeProgamFromSources(gl,vertexShaderSource,fragmentShaderSource);
        
        this.aPositionLocation = gl.getAttribLocation(this.program, 'a_position');

        this.uProjectionMatrixLocation = gl.getUniformLocation(this.program, 'u_projection_matrix');

        this.uViewMatrixLocation = gl.getUniformLocation(this.program, 'u_view_matrix');

        this.uModelMatrixLocation = gl.getUniformLocation(this.program, 'u_model_matrix');
        
        this.uLightPosLocation = gl.getUniformLocation(this.program, 'u_light_pos');
    }
}
