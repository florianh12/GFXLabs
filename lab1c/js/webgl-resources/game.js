export class Game {
    //maybe later for dots
    //objects;
    pacman;
    ghosts;

    constructor(pacman, ghosts) {
        this.pacman = pacman;
        this.ghosts = ghosts;
    }

    gameOver() {
        for(let i = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].reset();
        }

        this.pacman.reset();

        console.log(this.pacman.stop);
        
    }
}