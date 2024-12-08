import { Shader } from './shader.js';
import * as webglUtils from './webgl-helper-functions.js';

export class ShadowShader  extends Shader {
    filename = 'default';
    program = -2;
    aPositionLocation = -2;
    uModelMatrixLocation = -2;
    uLightProjectionMatrix = -2;
    uLightWorldMatrix = -2;

    constructor(filename = 'default') {
        super(filename);
        this.filename = filename;
    }

    async init(gl) {
        const vertexShaderSource = await fetch(`./shaders/${this.filename}.vert`).then(file => file.text());
        const fragmentShaderSource = await fetch(`./shaders/${this.filename}.frag`).then(file => file.text());
        
        this.program = webglUtils.makeProgamFromSources(gl,vertexShaderSource,fragmentShaderSource);
        
        this.aPositionLocation = gl.getAttribLocation(this.program, 'a_position');

        this.uModelMatrixLocation = gl.getUniformLocation(this.program, 'u_model_matrix');


        this.uLightProjectionMatrix = gl.getUniformLocation(this.program, 'u_light_projection_matrix');

        this.uLightWorldMatrix = gl.getUniformLocation(this.program, 'u_light_world_matrix');
    }
}