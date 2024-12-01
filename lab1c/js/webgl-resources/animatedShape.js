import { OBJParser } from "./obj-parser.js";
import { Shape } from "./shape.js";

export class AnimatedShape extends Shape {
    current_frame = 0;
    frame_offset = 0;
    frames = [];
    obj_parser = new OBJParser();
    filename = "./sampleModels/pacmanAnimation/pacman_chomp";
    
    /**
     * 
     * @param {Number} frame_count 
     * @param {Shape} first_frame 
     * @param {String} filename 
     */
    constructor(frame_count,filename = "./sampleModels/pacmanAnimation/pacman_chomp") {
        if (frame_count < 1)
            throw new Error("Not enough animation frames");
        super([],[],[],[]);
        this.filename = filename;
        this.frame_count = frame_count;
        this.obj_parser = new OBJParser();
    }

    async loadAnimationFrames() {
        // for(let i = 0; i < this.frame_count; i++) {

        //     let frame = await this.obj_parser.parseObjectFromFile(this.filename+String(i+1)+'.obj');
            
            
        //     this.normals.push(...frame.normals);
        //     this.colors.push(...frame.colors);

        //     for(let j = 0; j < frame.indices.length; j++) {
        //         frame.indices[j] += this.vertices.length/3;
        //     }
            
        //     this.indices.push(...frame.indices);
        //     this.vertices.push(...frame.vertices);            
        // }
        [this.vertices, this.normals,this.colors,this.indices] = await this.obj_parser.parseAnimationFromFiles(this.frame_count,this.filename);
        this.frame_offset = this.indices.length/this.frame_count;
        console.log(this.frame_offset,this.indices,this.indices.length / this.frame_count);
        console.log(await this.obj_parser.parseAnimationFromFiles(this.frame_count,this.filename));
    }

    async init(gl,shader) {
        await this.loadAnimationFrames();
        await super.init(gl,shader);
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

        const indicesPerFrame = this.indices.length / this.frame_count;
        const offset = indicesPerFrame * this.current_frame * Uint16Array.BYTES_PER_ELEMENT; // Offset in bytes
        const count = indicesPerFrame; 
        let frame = 50;

        gl.drawElements(gl.TRIANGLES, this.frame_offset, gl.UNSIGNED_SHORT, this.frame_offset*frame);

       this.current_frame = (this.current_frame + 1) % this.frame_count;
    }

}