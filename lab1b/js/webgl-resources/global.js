import * as glm from '../gl-matrix/dist/esm/index.js';
import { Shader } from './shader.js';
import { LightSource } from './lightsource.js';
import { Camera } from './camera.js';

export class Global {
    camera = new Camera();
    light = new LightSource(undefined,10);
    projectionMatrix = glm.mat4.create();
    projectionMatrixInitDone = false;
    scalingMatrix = glm.mat4.create();
    rotationMatrix = glm.mat4.create();
    translationMatrix = glm.mat4.create();
    globalModelViewMatrix = glm.mat4.create();
    diffuse_only = false;
    vao = -1;
    count = 0;

    constructor() {
        this.updateGlobalModelViewMatrix();
        console.log("ViewMatrixTest:",glm.mat4.lookAt(glm.mat4.create(),glm.vec3.fromValues(1.0,0.0,2.0),glm.vec3.fromValues(1.0,1.0,0.0),glm.vec3.fromValues(0.0,1.0,0.0)));
    }

    initProjectionMatrix(clientWidth,clientHeight) {
        glm.mat4.perspective(
            this.projectionMatrix,
            ((60 * Math.PI) / 180),//field of view in rad
            clientWidth / clientHeight,//aspect 
            0.1,//zNear
            2000.0//zFar
        );
        console.log("Orthographic Projection:",glm.mat4.orthoNO(glm.mat4.create(),-1.0,1.0,-1.0,1.0,0.1,100.0));
        //create light projection matrix
        const lightProjectionMatrix = glm.mat4.create();

        glm.mat4.perspective(lightProjectionMatrix,Math.PI,1.0,0.1,2000.0);

        this.light.initProjectionMatrix(lightProjectionMatrix);

        this.projectionMatrixInitDone = true;
    }

    initGlobalCoordinateSystem(gl, shader) {
        this.vao = gl.createVertexArray();

        gl.bindVertexArray(this.vao);

        this.bufferCoordinateSystemVertices(gl, shader);

        this.bufferCoordinateSystemColors(gl, shader);
    }

    bufferCoordinateSystemVertices(gl,shader) {
        const coordinateSystemPositionBuffer = gl.createBuffer();

        gl.enableVertexAttribArray(shader.aPositionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, coordinateSystemPositionBuffer);

        const coordianteSystemVertices = [
            0.0,0.0,0.0,
            10.0,0.0,0.0,
            0.0,0.0,0.0,
            0.0,10.0,0.0,
            0.0,0.0,0.0,
            0.0,0.0,10.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordianteSystemVertices), gl.STATIC_DRAW);

        gl.vertexAttribPointer(shader.aPositionLocation,3/*components amount*/,gl.FLOAT,false/*normalize*/,0/*stride*/,0/*offset*/);
    }

    bufferCoordinateSystemColors(gl,shader) {
        const coordinateSystemColorBuffer = gl.createBuffer();

        gl.enableVertexAttribArray(shader.aColorLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, coordinateSystemColorBuffer);

        const coordianteSystemColors = [
            1.0,0.0,0.0,1.0,
            1.0,0.0,0.0,1.0,
            0.0,1.0,0.0,1.0,
            0.0,1.0,0.0,1.0,
            0.0,0.0,1.0,1.0,
            0.0,0.0,1.0,1.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordianteSystemColors), gl.STATIC_DRAW);

        gl.vertexAttribPointer(shader.aColorLocation,4/*components amount*/,gl.FLOAT,false/*normalize*/,0/*stride*/,0/*offset*/);
    }

    translate(x = 0.0, y = 0.0, z = 0.0){
        //rotate x,y,z coordinates to counter rotation of coordinate system 
        const adaptedCoordinates = glm.vec4.fromValues(x,y,z,1.0);
        const invertRotationMatrix = glm.mat4.create();
        //use inverse rotation matrix to counter axis rotation
        glm.mat4.invert(invertRotationMatrix,this.rotationMatrix);
        //actually apply rotation to coordinates
        glm.vec4.transformMat4(adaptedCoordinates,adaptedCoordinates,invertRotationMatrix);
        
        //actual translation
        glm.mat4.translate(
            this.translationMatrix,
            this.translationMatrix,
            glm.vec3.fromValues(adaptedCoordinates[0],adaptedCoordinates[1],adaptedCoordinates[2]));

        //applys changes
        this.updateGlobalModelViewMatrix();
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

        // recalculate matrix passed to shader
        this.updateGlobalModelViewMatrix();
    }

    scale(x = 1.0, y = 1.0, z = 1.0) {
        //update scaling matrix
        glm.mat4.scale(
            this.scalingMatrix,
            this.scalingMatrix,
            glm.vec3.fromValues(x,y,z));

        // recalculate matrix passed to shader
        this.updateGlobalModelViewMatrix();
    }

    updateGlobalModelViewMatrix() {
        //combine camera and scaling into globalModelViewMatrix
        glm.mat4.multiply(
            this.globalModelViewMatrix,
            glm.mat4.create(),
            this.camera.viewMatrix
        );

        glm.mat4.mul(
            this.globalModelViewMatrix,
            this.globalModelViewMatrix,
            this.scalingMatrix
        )

        //add rotation
        glm.mat4.mul(
            this.globalModelViewMatrix,
            this.globalModelViewMatrix,
            this.rotationMatrix
        )

        //adds translation
        glm.mat4.multiply(
            this.globalModelViewMatrix,
            this.globalModelViewMatrix,
            this.translationMatrix
        );
    }
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Shader} shader 
     * @param {mat4} modelMatrix 
     */
    applyUniforms(gl, shader, modelMatrix) {
        const modelViewMatrix = glm.mat4.create();

        //calculate actual ModelViewMatrix with shape modelMatrix
        glm.mat4.mul(modelViewMatrix,this.globalModelViewMatrix,modelMatrix);
        
        const normalMatrix = glm.mat3.create();

         glm.mat3.normalFromMat4(normalMatrix,modelViewMatrix);
        
        //shader Matrices
        gl.uniformMatrix4fv(shader.uProjectionMatrixLocation, false, this.projectionMatrix);
        gl.uniformMatrix4fv(shader.uModelViewMatrixLocation, false, modelViewMatrix);
        gl.uniformMatrix3fv(shader.uNormalMatrixLocation, false, normalMatrix);

        // diffuse/specular
        if(this.diffuse_only) {
            gl.uniform1i(shader.uAmbientLocation, true);
            gl.uniform1i(shader.uDiffuseLocation, true);
            gl.uniform1i(shader.uSpecularLocation, false);
        } else {
            gl.uniform1i(shader.uAmbientLocation, true);
            gl.uniform1i(shader.uDiffuseLocation, true);
            gl.uniform1i(shader.uSpecularLocation, true);
        }

        //light uniforms
        gl.uniform4fv(shader.uLightPositionLocation, this.light.position);
        gl.uniform4fv(shader.uLightSpecularLocation, this.light.specular);
    }

    translateCamera(x = 0.0, y = 0.0, z = 0.0) {
        this.camera.translate(x,y,z);
        this.updateGlobalModelViewMatrix();
    }

    translateLight(x = 0.0, y = 0.0, z = 0.0) {
        this.light.translate(x,y,z);
    }
    rotateLight(axis,degree) {
        this.light.rotate(axis,degree);
    }

    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Shader} shader 
     */
    drawGlobalCoordinateSystem(gl,shader) {

        const normalMatrix = glm.mat3.normalFromMat4(glm.mat3.create(),this.camera.viewMatrix);

        
        gl.uniformMatrix4fv(shader.uProjectionMatrixLocation, false, this.projectionMatrix);
        gl.uniformMatrix4fv(shader.uModelViewMatrixLocation, false, this.camera.viewMatrix);
        gl.uniformMatrix3fv(shader.uNormalMatrixLocation, false, normalMatrix);
        //select corret buffers
        gl.bindVertexArray(this.vao);

        //actual drawcall
        gl.drawArrays(gl.LINES,0,6);

    }

    /**
     * @returns {mat4}
     */
    calculatelightViewProjectionMatrix() {
        const lightViewProjectionMatrix = glm.mat4.create();
        glm.mat4.mul(lightViewProjectionMatrix,this.light.lightProjectionMatrix,this.light.lightViewMatrix);
        return lightViewProjectionMatrix;
    }
}