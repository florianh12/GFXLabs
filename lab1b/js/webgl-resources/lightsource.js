import * as glm from '../gl-matrix/dist/esm/index.js';
import { Shader } from './shader.js';


export class LightSource {
    position = glm.vec3.create();
    ambient = glm.vec4.fromValues(0.2, 0.2, 0.2, 1.0);
    diffuse = glm.vec4.fromValues(1.0,1.0,1.0,1.0);
    specular = glm.vec4.fromValues(1.0,1.0,1.0,1.0);

    constructor(x = 0.0, y = 0.0, z = 0.0) {
        
        this.updateLightPosition(x,y,z);
    }
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {WebGL2RenderingContext} gl 
     * @param {Shader} shader 
     */
    translate(x = 0.0, y = 0.0, z = 0.0, gl, shader) {
        this.updateLightPosition(this.position[0]+x,this.position[1]+y,this.position[2]+z);
        this.set(gl,shader);
    }

    updateLightPosition(x = 0.0, y = 0.0, z = 0.0) {
        this.position = glm.vec4.fromValues(x,y,z,1.0);

        console.log(this.position);

        //const lightViewMatrix = glm.mat4.lookAt(glm.mat4.create(),glm.vec3.fromValues(0.0,0.0,0.0),this.position,glm.vec3.fromValues(0.0,1.0,0.0));
        // console.log("Matrix",lightViewMatrix);

        // glm.vec4.transformMat4(this.position,this.position,lightViewMatrix);

        // console.log("Light:",this.position);
        
    }

    set(gl,shader) {
        gl.uniform4fv(shader.uLightPositionLocation, this.position);
        gl.uniform4fv(shader.uLightAmbientLocation, this.ambient);
        gl.uniform4fv(shader.uLightDiffuseLocation, this.diffuse);
        gl.uniform4fv(shader.uLightSpecularLocation, this.specular);
    }
}