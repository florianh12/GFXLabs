import { AnimatedShape } from "./animatedShape.js";
import { Shape } from "./shape.js";

export class LargeAnimatedShape extends Shape {
    currentFrame = 0;
    startFrame = 0;
    endFrame = 0;
    animatedShapes = [];
    filename = "./sampleModels/pacmanAnimation/pacman_chomp";

    constructor(startFrame,endFrame,filename = "./sampleModels/pacmanAnimation/pacman_chomp") {
        if (endFrame - startFrame < 1)
            throw new Error("Not enough animation frames");
        if(endFrame - startFrame + 1 <= 50)
            console.warn("Animation is too small, use AnimatedShape instead!");
        super([],[],[],[]);
        this.filename = filename;
        this.startFrame = startFrame;
        this.endFrame = endFrame;
        //50 cohosen because AnimatedShape struggles with frame 60
        for (let i = startFrame; i < endFrame+1; i += 50) {
            if(i+49 < endFrame+1)
                this.animatedShapes.push(new AnimatedShape(i,i+49,filename));
            else
                this.animatedShapes.push(new AnimatedShape(i,endFrame,filename));
        }
    }

    async init(gl,shader) {
        for (let i = 0; i < this.animatedShapes.length; i++) {
           await this.animatedShapes[i].init(gl,shader);
        }
    }

    translate(x = 0.0, y = 0.0, z = 0.0){
        for (let i = 0; i < this.animatedShapes.length; i++) {
            this.animatedShapes[i].translate(x,y,z);
        }
    }

    rotate(axis,degree) {
        for (let i = 0; i < this.animatedShapes.length; i++) {
            this.animatedShapes[i].rotate(axis,degree);
        }
    }

    scale(x = 1.0, y = 1.0, z = 1.0) {
        for (let i = 0; i < this.animatedShapes.length; i++) {
            this.animatedShapes[i].scale(x,y,z);
        }
    }

    draw(gl, shader, global) {
        this.animatedShapes[Math.floor(this.currentFrame/50)].draw(gl, shader, global);
       this.currentFrame = (this.currentFrame + 1) % (this.endFrame);
    }

}