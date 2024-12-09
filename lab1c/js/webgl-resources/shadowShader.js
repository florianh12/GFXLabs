import * as webglUtils from './webgl-helper-functions.js';

export class ShadowShader {
    filename = 'shadow';
    program = -2;
    aPositionLocation = -2;
    uViewMatrixLocation = -2;
    uProjectionMatrixLocation = -2;
    uModelViewMatrixLocation = -2;

    constructor(filename = 'shadow') {
        this.filename = filename;
    }

    async init(gl) {
        const vertexShaderSource = await fetch(`./shaders/${this.filename}.vert`).then(file => file.text());
        const fragmentShaderSource = await fetch(`./shaders/${this.filename}.frag`).then(file => file.text());
        
        this.program = webglUtils.makeProgamFromSources(gl,vertexShaderSource,fragmentShaderSource);
        
        this.aPositionLocation = gl.getAttribLocation(this.program, 'a_position');

        this.uProjectionMatrixLocation = gl.getUniformLocation(this.program, 'u_projection_matrix');

        this.uModelViewMatrixLocation = gl.getUniformLocation(this.program, 'u_model_view_matrix');

        this.uShadowMatrixLocation = gl.getUniformLocation(this.program, 'u_shadow_matrix');
    }
}
