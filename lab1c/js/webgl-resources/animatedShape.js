import { OBJParser } from "./obj-parser.js";
import { Shape } from "./shape.js";

export class AnimatedShape extends Shape {
    currentFrame = 0;
    startFrame = 0;
    endFrame = 0;
    frameOffsets = [];
    indexCounts = [];
    frames = [];
    objParser = new OBJParser();
    filename = "./sampleModels/pacmanAnimation/pacman_chomp";
    
    /**
     * 
     * @param {Number} frameCount 
     * @param {Shape} first_frame 
     * @param {String} filename 
     */
    constructor(startFrame,endFrame,filename = "./sampleModels/pacmanAnimation/pacman_chomp") {
        if (endFrame - startFrame < 1)
            throw new Error("Not enough animation frames");
        if(endFrame - startFrame + 1 > 50)
            throw new Error("Animation is too big, use: LargeAnimatedShape");
        super([],[],[],[]);
        this.filename = filename;
        this.startFrame = startFrame;
        this.endFrame = endFrame;
        this.objParser = new OBJParser();
    }

    async loadAnimationFrames() {
        [this.vertices, this.normals,this.colors,this.indices,this.frameOffsets,this.indexCounts] = await this.objParser.parseAnimationFromFiles(this.startFrame,this.endFrame,this.filename);
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

        gl.drawElements(gl.TRIANGLES, this.indexCounts[this.currentFrame], gl.UNSIGNED_SHORT, this.frameOffsets[this.currentFrame]);

       this.currentFrame = (this.currentFrame + 1) % this.frameOffsets.length;
    }

}