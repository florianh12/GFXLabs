import * as glm from '../gl-matrix/dist/esm/index.js';
import { OBJParser } from "./obj-parser.js";
import { Shape } from "./shape.js";

export class PacmanShapeController extends Shape {
    maxAngle = 30;
    currentAngle = 0;
    changeRate = 1;
    direction = 1;
    upper = -1;
    lower = -1;
    parser = new OBJParser();

    constructor() {

        super([],[],[],[]);
        this.parser = new OBJParser();
    }

    async init(gl,shader) {
        this.upper = await this.parser.parsePacman('./sampleModels/Pacman/PacmanUpper.obj',true,'./sampleModels/Pacman/PacmanUpper.png');
        this.lower = await this.parser.parsePacman('./sampleModels/Pacman/PacmanLower.obj', false);

        await this.upper.init(gl,shader);
        await this.lower.init(gl,shader);

        
        //console.log(this.modelMatrix);
    }

    async initShadow(gl, shader) {
        await this.upper.initShadow(gl, shader);
        await this.lower.initShadow(gl,shader);
    }

    //disentangle translation from rotation -> this override
    translate(x = 0.0, y = 0.0, z = 0.0){

        this.position[0] += x;
        this.position[1] += y;

        
        //actual translation
        glm.mat4.translate(
            this.translationMatrix,
            this.translationMatrix,
            glm.vec3.fromValues(x,y,z));

        //applys changes
        this.updateModelMatrix();
    }

    nextAnimationStep() {
        this.upper.rotate("x",this.changeRate*this.direction*-1);
        this.lower.rotate("x",this.changeRate*this.direction);

        this.currentAngle += this.changeRate*this.direction;

        if(this.currentAngle >= this.maxAngle)
            this.direction = -1.0;

        if (this.currentAngle <= 0.0)
            this.direction = 1.0;
    }

    draw(gl, shader, global) {

        this.upper.draw(gl, shader, global,this.modelMatrix);
        this.lower.draw(gl, shader, global, this.modelMatrix);        
        

        this.nextAnimationStep();
    }

    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {ShadowShader} shader 
     * @param {Global} global 
     */
    shadowPass(gl, shader, global) {
        
        this.upper.shadowPass(gl,shader,global, this.modelMatrix);
        this.lower.shadowPass(gl,shader,global, this.modelMatrix);
    }

}