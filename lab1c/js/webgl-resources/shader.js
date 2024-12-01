import * as webglUtils from './webgl-helper-functions.js';

export class Shader {
    filename = 'default';
    program = -2;
    aColorLocation = -1;
    aPositionLocation = -1;
    aVertexNormalLocation = -1;
    uViewMatrixLocation = -1;
    uProjectionMatrixLocation = -1;
    uGlobalTransformationMatrixLocation = -1;
    uLocalTransformationMatrixLocation = -1;
    uLightPositionLocation = -1;
    uLightAmbientLocation = -1;
    uLightDiffuseLocation = -1;
    uLightSpecularLocation = -1;
    uShadowMapLocation = -1;
    uLightViewProjectionMatrixLocation = -1;
    uGlobalTransformationMatrixLocation = -1;
    uModelMatrixLocation = -1;

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

        this.uLightSpecularLocation = gl.getUniformLocation(this.program, 'u_light_specular');

        this.uAmbientLocation = gl.getUniformLocation(this.program, 'u_ambient');

        this.uDiffuseLocation = gl.getUniformLocation(this.program, 'u_diffuse');

        this.uSpecularLocation = gl.getUniformLocation(this.program, 'u_specular');

        this.uShadowMapLocation =  gl.getUniformLocation(this.program, 'u_shadow_map');

        this.uLightProjectionModelViewMatrixLocation = gl.getUniformLocation(this.program, 'u_light_projection_model_view_matrix');
    }
}