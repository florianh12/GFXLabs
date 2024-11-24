import { Shader } from "./shader.js";
import * as webglUtils from './webgl-helper-functions.js';


export class ShadowShader extends Shader {
    uLightViewProjectionMatrixLocation = -1;
    uGlobalTransformationMatrixLocation = -1;
    aPositionLocation = -1;
    program = -1;

    async init(gl) {
        const vertexShaderSource = await fetch(`./shaders/${this.filename}.vert`).then(file => file.text());
        const fragmentShaderSource = await fetch(`./shaders/${this.filename}.frag`).then(file => file.text());
        
        this.program = webglUtils.makeProgamFromSources(gl,vertexShaderSource,fragmentShaderSource);
        
        this.aPositionLocation = gl.getAttribLocation(this.program, 'a_position');

        this.uLightViewProjectionMatrixLocation = gl.getUniformLocation(this.program, 'u_light_view_projection_matrix');

        this.uGlobalTransformationMatrixLocation = gl.getUniformLocation(this.program,'u_global_transformation_matrix');

        this.uLocalTransformationMatrixLocation = gl.getUniformLocation(this.program, 'u_model_matrix');
    }

}