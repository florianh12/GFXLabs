import * as glm from '../gl-matrix/dist/esm/index.js';

export class LightSource {
    position = glm.vec4.create();
    specular = glm.vec4.fromValues(1.0,1.0,1.0,1.0);
    rotationMatrix = glm.mat4.create();
    translationMatrix = glm.mat4.create();

    constructor(x = 0.0, y = 0.0, z = 0.0) {
        glm.mat4.fromTranslation(this.translationMatrix,glm.vec3.fromValues(x,y,z));
        this.updateLightPosition();
    }
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {WebGL2RenderingContext} gl 
     * @param {Shader} shader 
     */
    translate(x = 0.0, y = 0.0, z = 0.0) {
        glm.mat4.translate(this.translationMatrix,this.translationMatrix,glm.vec3.fromValues(x,y,z))
        this.updateLightPosition();
    }

    rotate(axis,degree) {
        //converts degree to radians for glmatrix
        const rad = (degree * Math.PI) / 180;
        let rotationAxisVector;

        // choose coordnate system vector based on axis parameter
        // default z axis, because that makes the object rotate 
        // along the projection plane
        switch(axis) {
            case "x":
                rotationAxisVector = glm.vec3.fromValues(1.0,0.0,0.0);
                break;
            case "y":
                rotationAxisVector = glm.vec3.fromValues(0.0,1.0,0.0);
                break;
            case "z":
                rotationAxisVector = glm.vec3.fromValues(0.0,0.0,1.0);
                break;
            default:
                rotationAxisVector = glm.vec3.fromValues(0.0,0.0,1.0);
        }

        //apply rotation to matrix
        glm.mat4.rotate(
            this.rotationMatrix,
            this.rotationMatrix,
            rad,
            rotationAxisVector);

        this.updateLightPosition();
    }

    updateLightPosition() {
        //calculate model matrix for light
        const lightModelMatrix = glm.mat4.mul(glm.mat4.create(),this.rotationMatrix,this.translationMatrix);

        const positionVec4 = glm.vec4.create();
        positionVec4[3] = 1.0;
        glm.vec4.transformMat4(positionVec4,positionVec4,lightModelMatrix);
        this.position = positionVec4;   

        //const lightViewMatrix = glm.mat4.lookAt(glm.mat4.create(),glm.vec3.fromValues(0.0,0.0,0.0),this.position,glm.vec3.fromValues(0.0,1.0,0.0));
        // console.log("Matrix",lightViewMatrix);

        // glm.vec4.transformMat4(this.position,this.position,lightViewMatrix);

        // console.log("Light:",this.position);
        
    }
}