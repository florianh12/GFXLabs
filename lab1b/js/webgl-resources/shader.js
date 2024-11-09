import * as webglUtils from './webgl-helper-functions.js';

export class Shader {
    filename = 'default';
    program = -2;
    aColorLocation = -2;
    aPositionLocation = -2;
    aVertexNormalLocation = -2;
    uViewMatrixLocation = -2;
    uProjectionMatrixLocation = -2;
    uGlobalTransformationMatrixLocation = -2;
    uLocalTransformationMatrixLocation = -2;
    uLightPositionLocation = -2;
    uLightAmbientLocation = -2;
    uLightDiffuseLocation = -2;
    uLightSpecularLocation = -2;

    constructor(filename = 'default') {
        this.filename = filename;
    }

    async init(gl) {
        const vertexShaderSource = await fetch(`./shaders/${this.filename}.vert`).then(file => file.text());
        const fragmentShaderSource = await fetch(`./shaders/${this.filename}.frag`).then(file => file.text());
        
        this.program = webglUtils.makeProgamFromSources(gl,vertexShaderSource,fragmentShaderSource);
        
        this.aPositionLocation = gl.getAttribLocation(this.program, 'a_position');

        this.aColorLocation = gl.getAttribLocation(this.program, 'a_color');
        
        this.aVertexNormalLocation = gl.getAttribLocation(this.program, 'a_vertex_normal');
        
        this.uViewMatrixLocation = gl.getUniformLocation(this.program, 'u_view_matrix');
        
        this.uProjectionMatrixLocation = gl.getUniformLocation(this.program, 'u_projection_matrix');

        this.uModelViewMatrixLocation = gl.getUniformLocation(this.program, 'u_model_view_matrix');

        this.uNormalMatrixLocation = gl.getUniformLocation(this.program, 'u_normal_matrix');

        this.uLightPositionLocation = gl.getUniformLocation(this.program, 'u_light_position');

        this.uLightAmbientLocation = gl.getUniformLocation(this.program, 'u_light_ambient');

        this.uLightDiffuseLocation = gl.getUniformLocation(this.program, 'u_light_diffuse');

        this.uLightSpecularLocation = gl.getUniformLocation(this.program, 'u_light_specular');

        this.uAmbientLocation = gl.getUniformLocation(this.program, 'u_ambient');

        this.uDiffuseLocation = gl.getUniformLocation(this.program, 'u_diffuse');

        this.uSpecularLocation = gl.getUniformLocation(this.program, 'u_specular');
    }
}