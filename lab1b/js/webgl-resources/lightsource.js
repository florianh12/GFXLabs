import * as glm from '../gl-matrix/dist/esm/index.js';


export class LightSource {
    position = glm.vec3.create();
    ambient = glm.vec4.fromValues(0.2, 0.2, 0.2, 1.0);
    diffuse = glm.vec4.fromValues(1.0,1.0,1.0,1.0);
    specular = glm.vec4.fromValues(1.0,1.0,1.0,1.0);

    constructor(x = 0.0, y = 0.0, z = 0.0) {
        this.position = glm.vec4.fromValues(x,y,z,1.0);
    }

    set(gl,shader) {
        gl.uniform4fv(shader.uLightPositionLocation, this.position);
        gl.uniform4fv(shader.uLightAmbientLocation, this.ambient);
        gl.uniform4fv(shader.uLightDiffuseLocation, this.diffuse);
        gl.uniform4fv(shader.uLightSpecularLocation, this.specular);
    }
}