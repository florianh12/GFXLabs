import * as glm from '../gl-matrix/dist/esm/index.js';
import { OBJParser } from "./obj-parser.js";
import { Shape } from "./shape.js";

export class GhostShape extends Shape {
    maxAngle = 30;
    currentAngle = 0;
    changeRate = 1;
    direction = 1;
    shape = -1;
    parser = new OBJParser();
    color = 'Blue';

    constructor(color = 'Blue') {

        super([],[],[],[]);
        this.parser = new OBJParser();
        this.color = color;
    }

    async init(gl,shader) {
        const texturePath = './sampleModels/Pacman/Ghost'+this.color+'.png';
        this.shape = await this.parser.parsePacman('./sampleModels/Pacman/Ghost.obj',true,texturePath);
        await this.shape.init(gl,shader);

        this.shape.rotate("x",90);
        
        //console.log(this.modelMatrix);
    }

    //disentangle translation from rotation -> this override
    translate(x = 0.0, y = 0.0, z = 0.0){
        
        //actual translation
        glm.mat4.translate(
            this.translationMatrix,
            this.translationMatrix,
            glm.vec3.fromValues(x,y,z));

        //applys changes
        this.updateModelMatrix();
    }

    draw(gl, shader, global) {

        this.shape.draw(gl, shader, global,this.modelMatrix);
        
    }

}