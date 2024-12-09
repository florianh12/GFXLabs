import * as glm from '../gl-matrix/dist/esm/index.js';
import { shearXY } from './webgl-helper-functions.js';

export class Camera {
    //needs to be reset to 0.0,0.0,8.0 and 0.0,0.0,-1.0
    eye = glm.vec3.create();//20
    target = glm.vec3.create();
    shearMatrix = shearXY(0.6,0.6);

    constructor() {
        this.viewMatrix = glm.mat4.create();
        this.eye = glm.vec3.fromValues(0.0,-5.0,10.0);//20
        this.target = glm.vec3.fromValues(0.0,0.0,0.0);
        this.initViewMatrix();
    }

    initViewMatrix() {

        //glm.mat4.lookAt(this.viewMatrix,this.eye,this.target, glm.vec3.fromValues(0.0,1.0,0.0));
        glm.mat4.lookAt(this.viewMatrix, this.eye, this.target, glm.vec3.fromValues(0.0,1.0,0.0));
    }

    translate(x,y,z) {
        glm.vec3.add(this.eye,this.eye,glm.vec3.fromValues(x,y,z));
        glm.vec3.add(this.target,this.target,glm.vec3.fromValues(x,y,z));

        this.initViewMatrix();
    }
}