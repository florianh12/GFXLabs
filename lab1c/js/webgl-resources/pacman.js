import { set } from "../gl-matrix/dist/esm/mat2.js";
import { Global } from "./global.js";
import { Shape } from "./shape.js";
import { calculateRotationDegrees } from "./webgl-helper-functions.js";


export class Pacman {
    shape;
    global;
    direction = 3;
    timer = -1;
    degreeMap = new Map();
    translationRate = 0.0;//0.03
    changeDir = 0;
    currentAngle = 0;
    targetAngle = 0;
    rotationStepSize = 10;
    currentRowPos = 0.0;
    

    /**
     * 
     * @param {Global} global 
     * @param {Shape} shape 
     */
    constructor(global, shape) {
        this.shape = shape;
        this.global = global;
        this.direction = 3;

        this.degreeMap = new Map();
        this.degreeMap.set(3,0);
        this.degreeMap.set(1,270);
        this.degreeMap.set(4,180);
        this.degreeMap.set(2,90);
        this.rotationStepSize = 10;
        //movement
        setInterval(this.move.bind(this),10);
    }

    /**
     * 
     * @param {Number} newDirection 1 == up, 2 == down, 3 == right, 4 == left
     */
    async translate(newDirection = 0) {
        if(newDirection < 0 || newDirection > 4) {
            return;
        }
            this.targetAngle = this.degreeMap.get(newDirection);

            if(Math.sign(calculateRotationDegrees(this.currentAngle,this.targetAngle)) == -1) {
                this.rotationStepSize = Math.abs(this.rotationStepSize);
            } else {
                this.rotationStepSize = Math.abs(this.rotationStepSize)*(-1);
            }
            console.log(calculateRotationDegrees(this.currentAngle,this.targetAngle));
            this.changeDir = newDirection;
    }

    move() {
        
        switch(this.direction){
            case 1:
                this.shape.translate(0.0,this.translationRate);
                this.global.translateCamera(0.0,this.translationRate);
                break;
            case 2:
                this.shape.translate(0.0,-this.translationRate);
                this.global.translateCamera(0.0,-this.translationRate);
                break;
            case 3:
                this.shape.translate(this.translationRate);
                this.global.translateCamera(this.translationRate);
                break;
            case 4:
                this.shape.translate(-this.translationRate);
                this.global.translateCamera(-this.translationRate);
                break;
        }

        this.currentRowPos = (this.currentRowPos+this.translationRate);

        //1.5 is the spacing between rows, the following code prevents weird unintentional wall crashes
        if(this.currentRowPos >= 1.5) {
            this.currentRowPos = 0.0;

            if(this.changeDir != 0) {
                this.direction = this.changeDir;
                this.changeDir = 0;
            }
            
        }
        if(this.currentAngle != this.targetAngle) {
            this.shape.rotate("z",this.rotationStepSize);
            this.currentAngle += this.rotationStepSize;
            if( this.currentAngle >= 360) {
                this.currentAngle -= 360;
            } else if (this.currentAngle < 0){
                this.currentAngle += 360;
            }
            console.log("current",this.currentAngle);

        }
    }
}