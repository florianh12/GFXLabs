import { set } from "../gl-matrix/dist/esm/mat2.js";
import { Game } from "./game.js";
import { Shape } from "./shape.js";
import { calculateRotationDegrees } from "./webgl-helper-functions.js";


export class Ghost {
    shape;
    walls;
    startPosition;
    direction = 3;
    timer = -1;
    degreeMap = new Map();
    translationRate = 0.03;//0.03
    changeDir = 0;
    currentAngle = 0;
    targetAngle = 0;
    rotationStepSize = 10;
    currentRowPos = 0.0;
    position = [0.0,0.0];
    //for direction changes
    maxCooldown = 10000;
    minCooldown = 1000;
    stop = false;
    directionTimerID;
    movementIntervalID;
    
    

    /**
     *  
     * @param {Shape} shape
     * @param {Shape[]} walls
     * @param {[]} position
     */
    constructor(shape, walls, position) {
        this.shape = shape;
        this.direction = 3;

        this.degreeMap = new Map();
        this.degreeMap.set(3,0);
        this.degreeMap.set(1,270);
        this.degreeMap.set(4,180);
        this.degreeMap.set(2,90);
        this.rotationStepSize = 10;
        this.walls = walls;
        this.position = [...position];
        this.startPosition = [...position];

        this.shape.translate(this.position[0],this.position[1]);
        //movement
        this.movementIntervalID = setInterval(this.move.bind(this),10);
        //random direction changes (cooldown to prevent stuck in wall bug)
        //this.directionTimerID = setTimeout(this.changeDirection.bind(this),100);
    }

    changeDirection() {
        const delay = Math.floor(Math.random() * (this.maxCooldown-this.minCooldown)) + this.minCooldown;
        const newDirection = Math.floor(Math.random() * 4) + 1;

        this.translate(newDirection);
        
        //this.directionTimerID = setTimeout(this.changeDirection.bind(this), delay);
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
        
        

        for( let i = 0; i < this.walls.length; i++) {
            let objectPosition = this.walls[i].position;
            let boundingRectangle = this.walls[i].boundingRectangle;
            if(collisionPosition[0] <= boundingRectangle[0][0]+objectPosition[0] && 
                collisionPosition[0] >= boundingRectangle[0][1]+objectPosition[0] &&
                collisionPosition[1] <= boundingRectangle[1][0]+objectPosition[1] &&
                collisionPosition[1] >= boundingRectangle[1][1]+objectPosition[1]) {
                    if(this.currentRowPos != 0) {
                        this.currentRowPos = 0;
                    }
                    const newDirection = Math.floor(Math.random() * 4) + 1;
                    this.translate(newDirection);                    
                    return true;
                }
        }
        return false;
    }
    clearIntervals() {
        //clearTimeout(this.directionTimerID);
        clearInterval(this.movementIntervalID);
    }

    reset() {
        
        this.shape.resetTranslation();
        this.shape.translate(this.startPosition[0],this.startPosition[1]);
        this.position = [...this.startPosition];
        this.stop = false;
        this.direction = 3;
    }

    restart() {
        this.movementIntervalID = setInterval(this.move.bind(this),10);
        //random direction changes (cooldown to prevent stuck in wall bug)
        //this.directionTimerID = setTimeout(this.changeDirection.bind(this),100);
    }

    move() {
        console.log("ghost",this.shape.color,this.direction, this.currentRowPos, this.startPosition);
        
        //1.5 is the spacing between rows, the following code prevents weird unintentional wall crashes
        if(this.currentRowPos >= 1.5 || this.currentRowPos < this.translationRate) {
            this.currentRowPos = 0.0;
        }


        //check if change direction is possible (when in center of cell and no collision in change direction)
        if(this.changeDir != 0 && this.currentRowPos == 0.0 && !this.checkCollision(this.changeDir)) {
            this.direction = this.changeDir;
            this.changeDir = 0;
        }

        if(!this.checkCollision(this.direction)) {
            switch(this.direction){
                case 1:
                    this.shape.translate(0.0,this.translationRate);
                    this.position[1] += this.translationRate;
                    break;
                case 2:
                    this.shape.translate(0.0,-this.translationRate);
                    this.position[1] += -this.translationRate;
                    break;
                case 3:
                    this.shape.translate(this.translationRate);
                    this.position[0] += this.translationRate;
                    break;
                case 4:
                    this.shape.translate(-this.translationRate);
                    this.position[0] += -this.translationRate;
                    break;
            }
    
            this.currentRowPos = (this.currentRowPos+this.translationRate);
        }
    }
}