import * as glm from '../gl-matrix/dist/esm/index.js';
import { ShearXY } from './webgl-helper-functions.js';

export class Camera {
    //needs to be reset to 0.0,0.0,8.0 and 0.0,0.0,-1.0
    eye = glm.vec3.fromValues(0.0,0.0,20.0);//20
    shearMatrix = ShearXY(1.0,1.5);

    constructor() {
        this.viewMatrix = this.initViewMatrix(this.eye);
    }

    initViewMatrix(eye) {
        const matrix = glm.mat4.create();
        const target = glm.mat4.create();

        glm.vec3.add(target,eye,glm.vec3.fromValues(0.0,0.0,-1.0));
        glm.mat4.lookAt(matrix,eye,target, glm.vec3.fromValues(0.0,1.0,0.0));

        return matrix;
    }

    translate(x,y,z) {
        glm.vec3.add(this.eye,this.eye,glm.vec3.fromValues(x,y,z));

        this.viewMatrix = this.initViewMatrix(this.eye);
    }
}