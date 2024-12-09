import { set } from "../gl-matrix/dist/esm/mat2.js";
import { Global } from "./global.js";
import { Shape } from "./shape.js";
import { calculateRotationDegrees } from "./webgl-helper-functions.js";


export class Pacman {
    shape;
    global;
    walls;
    dots;
    direction = 3;
    timer = -1;
    degreeMap = new Map();
    translationRate = 0.03;//0.03
    changeDir = 0;
    currentAngle = 0;
    targetAngle = 0;
    rotationStepSize = 1;
    currentRowPos = 0.0;
    position = [0.0,0.0];
    ghosts = 0;
    score = 0;
    movementIntervalID;

    //jump mechanic
    onGround = true;
    jump = false;
    jumpSteps = [];
    currentJumpStep = 0;
    //steps equal three grid cells
    jumpStepCount = 150;
    jumpHeight = 5.5;
    
    

    /**
     * 
     * @param {Global} global 
     * @param {Shape} shape 
     */
    constructor(global, shape, walls, ghosts, dots) {
        this.shape = shape;
        this.global = global;
        this.direction = 3;

        this.degreeMap = new Map();
        this.degreeMap.set(3,0);
        this.degreeMap.set(1,270);
        this.degreeMap.set(4,180);
        this.degreeMap.set(2,90);
        this.rotationStepSize = 10;
        this.walls = walls;
        this.ghosts = ghosts;
        this.dots = dots;
        this.score = 0;

        //calculate jump z translate sequence
        for(let i = 1; i < (this.jumpStepCount/2)+1; i++) {
            const t = i /this.jumpStepCount;
            this.jumpSteps.push((this.jumpHeight/this.jumpStepCount)*Math.sin(Math.PI * t));
        }

        for(let i = this.jumpSteps.length-1; i >= 0; i--) {
            this.jumpSteps.push(-this.jumpSteps[i]);
        }

        console.log("JumpSteps", this.jumpSteps);
        //movement
        this.movementIntervalID = setInterval(this.move.bind(this),10);
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

    clearIntervals() {
        clearInterval(this.movementIntervalID);
    }

    reset() {
        
        //reset Camera
        this.global.translateCamera(-this.position[0], -this.position[1]);
        
        //reset position and movement direction
        this.shape.resetTranslation();
        this.position = [0.0,0.0];
        this.direction = 3;

        this.targetAngle = this.degreeMap.get(3);
        this.currentRowPos = 0.0;

        //reset dots and score
        for(let i = 0; i < this.dots.length; i++) {
            this.dots[i].setVisibility(true);
        }

        this.score = 0;
        
    }

    restart() {
        this.movementIntervalID = setInterval(this.move.bind(this),10);
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
                    return true;
            }
        }
        //if on ground eat dots            
        if(this.onGround) {
            for (let i = 0; i < this.dots.length; i++) {
                if(!this.dots[i].visibility)
                    continue;
    
                const dotPos = this.dots[i].position;
                if (dotPos[0] <= this.position[0]+0.1 &&
                    dotPos[0] >= this.position[0]-0.1 &&
                    dotPos[1] <= this.position[1]+0.1 &&
                    dotPos[1] >= this.position[1]-0.1) {
                    this.dots[i].setVisibility(false);
                    this.score += 1;
                }
        }
        
            
        }
        
        return false;
    }

    checkGameOver() {
        //checks if all dots are eaten
        if(this.score == this.dots.length) {
            return true;
        }

        //checks if still jumping
        if(!this.onGround) {
            return false;
        }

        for(let i = 0; i < this.ghosts.length; i++) {
            //0.75 is the width of the rectangle of the scaled ghost
            if(this.position[0] <= 0.75+this.ghosts[i].position[0] && 
                this.position[0] >= -0.75+this.ghosts[i].position[0] &&
                this.position[1] <= 0.75+this.ghosts[i].position[1] &&
                this.position[1] >= -0.75+this.ghosts[i].position[1]) {
                    return true;
                }
        }
        return false;
    }

    gameOver() {
        this.clearIntervals();

        for(let i = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].clearIntervals();
        }
            
        setTimeout(this.newGame.bind(this),500);

    }

    newGame() {
        this.reset();
            for(let i = 0; i < this.ghosts.length; i++) {
                this.ghosts[i].reset();
            }
            this.restart();
            for(let i = 0; i < this.ghosts.length; i++) {
                this.ghosts[i].restart();
            }
    }

    startJump() {
        this.jump = true;
    }

    move() {
        if(this.checkGameOver()) {
            this.gameOver();
            return;
        }
        
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

        //check if change direction is possible, and do so if yes
        //(when in center of cell and no collision in change direction)
        if(this.changeDir != 0 && this.currentRowPos == 0.0 && !this.checkCollision(this.changeDir)) {
            this.direction = this.changeDir;
            this.changeDir = 0;
        }

        //jump checks
        if(this.jump) {
            console.log(this.jump);
            
        }
        if(this.jump && this.onGround) {
            this.jump = false;
            this.onGround = false;
            this.currentJumpStep = 0;
        }

        if(!this.onGround) {
            if (this.currentJumpStep >= this.jumpSteps.length) {
                this.onGround = true;
            } else {
                this.shape.translate(undefined, undefined, this.jumpSteps[this.currentJumpStep++]);
            }
            
        }

        

        //rotation animation
        if(this.currentAngle != this.targetAngle) {
            this.shape.rotate("z",this.rotationStepSize);
            this.currentAngle += this.rotationStepSize;
            if( this.currentAngle >= 360) {
                this.currentAngle -= 360;
            } else if (this.currentAngle < 0){
                this.currentAngle += 360;
            }
        }

        //actual movement calculations with collision check
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

            //update Ghost pacpos
            for(let i = 0; i < this.ghosts.length; i++) {
                this.ghosts[i].updatePacpos(this.position);
            }
        }
    }
}