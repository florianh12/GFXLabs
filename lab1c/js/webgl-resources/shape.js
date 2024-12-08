import * as glm from '../gl-matrix/dist/esm/index.js';
import { Global } from './global.js';
import { Shader } from './shader.js';

export class Shape {
    vao = -1;
    coordinateSystemVAO = -1;
    vertices = -1;
    normals = -1;
    colors = -1;
    indices = -1;
    scalingMatrix = -1;
    rotationMatrix = -1;
    translationMatrix = -1;
    modelMatrix = glm.mat4.create();
    position = [0.0,0.0];
    //only relevant for labyrinth walls [max_x,min_x][max_y,min_y]
    boundingRectangle = [[0.5,-0.5],[0.5,-0.5]];
    

    constructor(vertices, normals, colors, indices,
        scalingMatrix = glm.mat4.create(), 
        rotationMatrix = glm.mat4.create(),
        translationMatrix = glm.mat4.create()) {
        this.vertices = vertices;
        this.normals = normals;
        this.colors = colors;
        this.indices = indices;
        this.scalingMatrix = scalingMatrix;
        this.rotationMatrix = rotationMatrix;
        this.translationMatrix = translationMatrix;

        this.position = [0.0,0.0];
        this.boundingRectangle = [[0.5,-0.5],[0.5,-0.5]];
        
        //applies transformations if any exist
        this.updateModelMatrix();
    }

    async init(gl, shader) {
        this.initializeVAO(gl);
        this.bufferVertexData(gl, shader);
        this.bufferColorData(gl, shader);
        this.bufferNormalsData(gl, shader);
        this.bufferIndices(gl);
        this.bufferCoordinateSystem(gl,shader);
    }

    initializeVAO(gl) {

        this.vao = gl.createVertexArray();

        this.coordinateSystemVAO = gl.createVertexArray();
        
        gl.bindVertexArray(this.vao);
    }

    bufferVertexData(gl, shader) {
        const aPositionBuffer = gl.createBuffer();

        gl.enableVertexAttribArray(shader.aPositionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, aPositionBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices),gl.STATIC_DRAW);

        gl.vertexAttribPointer(shader.aPositionLocation,3/*components amount*/,gl.FLOAT,false/*normalize*/,0/*stride*/,0/*offset*/);
    }
    
    bufferNormalsData(gl, shader) {
        const aVertexNormalBuffer = gl.createBuffer();

        gl.enableVertexAttribArray(shader.aVertexNormalLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, aVertexNormalBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals),gl.STATIC_DRAW);

        gl.vertexAttribPointer(shader.aVertexNormalLocation,3/*components amount*/,gl.FLOAT,false/*normalize*/,0/*stride*/,0/*offset*/);
    }

    bufferColorData(gl, shader) {
        const aColorBuffer = gl.createBuffer();

        gl.enableVertexAttribArray(shader.aColorLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, aColorBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors),gl.STATIC_DRAW);

        gl.vertexAttribPointer(shader.aColorLocation,4/*components amount*/,gl.FLOAT,false/*normalize*/,0/*stride*/,0/*offset*/);
    }

    bufferIndices(gl) {
        const indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    bufferCoordinateSystem(gl, shader) {        
        
        gl.bindVertexArray(this.coordinateSystemVAO); //activate correct vao

        this.bufferCoordinateSystemVertices(gl, shader);

        this.bufferCoordinateSystemColors(gl, shader);
        
    }

    bufferCoordinateSystemVertices(gl,shader) {
        const coordinateSystemPositionBuffer = gl.createBuffer();

        gl.enableVertexAttribArray(shader.aPositionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, coordinateSystemPositionBuffer);

        const coordianteSystemVertices = [
            0.0,0.0,0.0,
            1.0,0.0,0.0,
            0.0,0.0,0.0,
            0.0,1.0,0.0,
            0.0,0.0,0.0,
            0.0,0.0,1.0,
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

    updateModelMatrix() {
        //combine rotation and scaling into model matrix
        glm.mat4.multiply(
            this.modelMatrix,
            this.rotationMatrix,
            this.scalingMatrix
        );

        //adds translation
        glm.mat4.multiply(
            this.modelMatrix,
            this.translationMatrix,
            this.modelMatrix
        );
    }

    translate(x = 0.0, y = 0.0, z = 0.0){
        //rotate x,y,z coordinates with local coordinate system
        const adaptedCoordinates = glm.vec4.fromValues(x,y,z,1.0);
        //update bounding rectangle
        this.position[0] += x;
        this.position[1] += y;

        console.log(this.position);

        glm.vec4.transformMat4(adaptedCoordinates,adaptedCoordinates,this.rotationMatrix);
        
        //actual translation
        glm.mat4.translate(
            this.translationMatrix,
            this.translationMatrix,
            glm.vec3.fromValues(adaptedCoordinates[0],adaptedCoordinates[1],adaptedCoordinates[2]));

        //applys changes
        this.updateModelMatrix();
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
        this.updateModelMatrix();
    }

    scale(x = 1.0, y = 1.0, z = 1.0) {
        //update bounding rectangle

        
        this.boundingRectangle[0][0] *= x;
        this.boundingRectangle[0][1] *= x;
        this.boundingRectangle[1][0] *= y;
        this.boundingRectangle[1][1] *= y;
        

        

        //update scaling matrix
        glm.mat4.scale(
            this.scalingMatrix,
            this.scalingMatrix,
            glm.vec3.fromValues(x,y,z));

        // recalculate matrix passed to shader
        this.updateModelMatrix();
    }

    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Shader} shader 
     * @param {Global} global 
     */
    draw(gl, shader, global) {
        global.applyUniforms(gl,shader,this.modelMatrix);

        gl.bindVertexArray(this.vao);

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Shader} shader 
     * @param {Global} global 
     */
    //only call this function after draw if the object is selected
    drawCoordianteSystem(gl, shader, global) {

        //just in case it's not set reset matrices
        global.applyUniforms(gl,shader,this.modelMatrix);
        
        gl.bindVertexArray(this.coordinateSystemVAO);
        
        gl.drawArrays(gl.LINES, 0, 6);
    }
}