import { set } from "../gl-matrix/dist/esm/mat2.js";
import { Global } from "./global.js";
import { Shape } from "./shape.js";
import { calculateRotationDegrees } from "./webgl-helper-functions.js";


export class Pacman {
    shape;
    global;
    objects;
    direction = 3;
    timer = -1;
    degreeMap = new Map();
    translationRate = 0.00;//0.03
    changeDir = 0;
    currentAngle = 0;
    targetAngle = 0;
    rotationStepSize = 10;
    currentRowPos = 0.0;
    position = [0.0,0.0];
    
    

    /**
     * 
     * @param {Global} global 
     * @param {Shape} shape 
     */
    constructor(global, shape, objects) {
        this.shape = shape;
        this.global = global;
        this.direction = 3;

        this.degreeMap = new Map();
        this.degreeMap.set(3,0);
        this.degreeMap.set(1,270);
        this.degreeMap.set(4,180);
        this.degreeMap.set(2,90);
        this.rotationStepSize = 10;
        this.objects = objects;
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

            

            this.changeDir = newDirection;
    }

    /**
     * @returns {Number[]}
     */
    calcCollisionPosition(inDirection) {
        //magic number 0.76, because 0.01 bigger than 1/2 grid entry size
        //prevents stepping into next grid cell, position is modified, depending on direction for adequate collission
        switch(inDirection) {
            case 1:
                return [this.position[0],this.position[1]+0.76];
                break;
            case 2:
                return [this.position[0],this.position[1]-0.76];
                break;
            case 3:
                return [this.position[0]+0.76,this.position[1]];
                break;
            case 4:
                return [this.position[0]-0.76,this.position[1]];
                break;
        }
    }

    checkCollision(inDirection) {
        let collisionPosition = this.calcCollisionPosition(inDirection);
        
        

        //starts at 2, because the object 0 is the labyrinth floor and object 1 is the pacman shape
        for( let i = 2; i < this.objects.length; i++) {
            let objectPosition = this.objects[i].position;
            let boundingRectangle = this.objects[i].boundingRectangle;
            if(collisionPosition[0] <= boundingRectangle[0][0]+objectPosition[0] && 
                collisionPosition[0] >= boundingRectangle[0][1]+objectPosition[0] &&
                collisionPosition[1] <= boundingRectangle[1][0]+objectPosition[1] &&
                collisionPosition[1] >= boundingRectangle[1][1]+objectPosition[1]) {
                    return true;
                }
                

        }
        return false;
    }

    move() {
        //1.5 is the spacing between rows, the following code prevents weird unintentional wall crashes
        if(this.currentRowPos >= 1.5 || this.currentRowPos < this.translationRate) {
            this.currentRowPos = 0.0;
        }

        //initiate rotation if direction change possible
        if (this.changeDir != 0 && this.targetAngle != this.degreeMap.get(this.changeDir) && !this.checkCollision(this.changeDir)) {
            this.targetAngle = this.degreeMap.get(this.changeDir);

            if(Math.sign(calculateRotationDegrees(this.currentAngle,this.targetAngle)) == -1) {
                this.rotationStepSize = Math.abs(this.rotationStepSize);
            } else {
                this.rotationStepSize = Math.abs(this.rotationStepSize)*(-1);
            }
        }

        //check if change direction is possible (when in center of cell and no collision in change direction)
        if(this.changeDir != 0 && this.currentRowPos == 0.0 && !this.checkCollision(this.changeDir)) {
            this.direction = this.changeDir;
            this.changeDir = 0;
        }

        if(this.currentAngle != this.targetAngle) {
            this.shape.rotate("z",this.rotationStepSize);
            this.currentAngle += this.rotationStepSize;
            if( this.currentAngle >= 360) {
                this.currentAngle -= 360;
            } else if (this.currentAngle < 0){
                this.currentAngle += 360;
            }
        }
        if(!this.checkCollision(this.direction)) {
            switch(this.direction){
                case 1:
                    this.shape.translate(0.0,this.translationRate);
                    this.global.translateCamera(0.0,this.translationRate);
                    this.position[1] += this.translationRate;
                    break;
                case 2:
                    this.shape.translate(0.0,-this.translationRate);
                    this.global.translateCamera(0.0,-this.translationRate);
                    this.position[1] += -this.translationRate;
                    break;
                case 3:
                    this.shape.translate(this.translationRate);
                    this.global.translateCamera(this.translationRate);
                    this.position[0] += this.translationRate;
                    break;
                case 4:
                    this.shape.translate(-this.translationRate);
                    this.global.translateCamera(-this.translationRate);
                    this.position[0] += -this.translationRate;
                    break;
            }
    
            this.currentRowPos = (this.currentRowPos+this.translationRate);
        }
    }
}