import * as glm from '../gl-matrix/dist/esm/index.js';
import { Shader } from './shader.js';
import { Shape } from "./shape.js";
import { loadTexture } from './webgl-helper-functions.js';

export class PacmanShape extends Shape {
    textureColorCoordinates = [];
    texture_active = false;
    texture = -1;
    textureFilePath = './sampleModels/Pacman/PacmanUpper.png';

    constructor(vertices, normals, colors, indices, 
        textureColorCoordinates, texture_active = false, textureFilePath = './sampleModels/Pacman/PacmanUpper.png') {
        super(vertices,normals,colors,indices);

        this.textureColorCoordinates = textureColorCoordinates;
        this.texture_active = texture_active;
        this.textureFilePath = textureFilePath;
    }

    async init(gl, shader) {
        await super.init(gl,shader);

        if(this.texture_active) {
            this.bufferTextureColorCoordinates(gl, shader);
            await this.bufferTexture(gl,this.textureFilePath);
        }

    }

    async bufferTexture(gl, filePath) {
        //flip texture y coordinates for webgl processing
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            
        //create webgl texture and load image
        const image = await loadTexture(filePath);

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture)

        //load image data into webgl texture
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,1024,1024,0,gl.RGB,gl.UNSIGNED_BYTE,image);

        //turn texture into mipmap
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)

        //unbind texture
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Shader} shader 
     */
    bufferTextureColorCoordinates(gl, shader) {
        gl.bindVertexArray(this.vao);
        
        const aTextureColorCoordinatesBuffer = gl.createBuffer();

        gl.enableVertexAttribArray(shader.aTextureColorCoordinateLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, aTextureColorCoordinatesBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureColorCoordinates),gl.STATIC_DRAW);

        gl.vertexAttribPointer(shader.aTextureColorCoordinateLocation,2/*components amount*/,gl.FLOAT,false/*normalize*/,0/*stride*/,0/*offset*/);
    }

    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Shader} shader 
     * @param {Global} global 
     * @param {mat4} pacmanModelMatrix
     */
    draw(gl, shader, global, pacmanModelMatrix) {
        const adaptedModelMatrix = glm.mat4.create();

        glm.mat4.mul(adaptedModelMatrix,pacmanModelMatrix,this.modelMatrix);

        global.applyUniforms(gl,shader,adaptedModelMatrix);

        gl.bindVertexArray(this.vao);

        if(this.texture_active) {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);

            gl.uniform1i(shader.uTextureActiveLocation, true);
        }

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

        gl.uniform1i(shader.uTextureActiveLocation, false);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

}