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

        //orient ghost correctly
        this.shape.rotate("y",-180);
        
    }

    //exchange translation with tagetTo
    translate(x = 0.0, y = 0.0, pac_x = 0.0, pac_y = 0.0){

        this.position[0] += x;
        this.position[1] += y;
        //actual translation
        glm.mat4.targetTo(
            this.translationMatrix, 
        glm.vec3.fromValues(this.position[0],this.position[1],0.0),
        glm.vec3.fromValues(pac_x,pac_y,0.0), 
        glm.vec3.fromValues(0.0,0.0,1.0));

        //applys changes
        this.updateModelMatrix();
    }

    draw(gl, shader, global) {

        this.shape.draw(gl, shader, global,this.modelMatrix);
        
    }

}