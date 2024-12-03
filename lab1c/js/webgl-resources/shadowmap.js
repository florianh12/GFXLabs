import * as glm from '../gl-matrix/dist/esm/index.js';
import { Global } from "./global.js";
import { Shader } from './shader.js';


export class ShadowMap {
    size = 1024;
    map = -1;
    frameBuffer = -1;
    shader = new Shader("shadows");

    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     */
    initTexture(gl) {
        //create and bind Texture
        this.map = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,this.map);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F,
            this.size,//width
            this.size,//height
            0, gl.DEPTH_COMPONENT,
            gl.FLOAT,//type
            null);

        //set parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //console.log(this.map);
    }

    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     */
    initFramebuffer(gl) {
        //create and bind framebuffer
        this.frameBuffer = gl.createFramebuffer();
        
        gl.bindFramebuffer(gl.FRAMEBUFFER,this.frameBuffer);

        //attach texture to framebuffer
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT, //attackment point
            gl.TEXTURE_2D, //Texture target
            this.map, //our "texture"
            0);
        
        //reset framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     */
    init(gl) {
        this.shader.init(gl);
        this.initTexture(gl);
        this.initFramebuffer(gl);
    }
    
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {mat4} lightViewProjectionMatrix
     * @param {Shape[]} objects
     * @param {Global} global
     */
    makeShadowPass(gl, objects, global) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.viewport(0,0,this.size,this.size);
        gl.clear(gl.DEPTH_BUFFER_BIT);

        gl.useProgram(this.shader.program);


        for (let i = 0; i < objects.length; i++) {
            objects[i].draw(gl,this.shader,global);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}