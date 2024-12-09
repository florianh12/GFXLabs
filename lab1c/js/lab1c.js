
import { generateCube, generatePyramid, generatePlane } from './webgl-resources/webgl-helper-functions.js';
import { Shader } from './webgl-resources/shader.js';
import { Global } from './webgl-resources/global.js';
//import Shape from './webgl-resources/shape.js';
import { OBJParser } from './webgl-resources/obj-parser.js';
import { Pacman } from './webgl-resources/pacman.js';
import { PacmanShapeController } from './webgl-resources/pacman-shape-controller.js';
import { PacmanShape } from './webgl-resources/pacman-shape.js';
import { GhostShape } from './webgl-resources/ghost-shape.js';
import { Ghost } from './webgl-resources/ghost.js';
import { Game } from './webgl-resources/game.js';
import * as glm from './gl-matrix/dist/esm/index.js';










const main = async () => {
    const u = undefined; //for selecting default values
    const defaultScale = [1.5,1.5];
    const colorPacman = [1.0,1.0,0.0,1.0];
    const colorPlane = [0.231, 0.361, 0.361, 1.0];
    const colorWall1 = [0.529, 0, 0.529,1.0];
    const colorWall2 = [0.231, 0, 0.231,1.0];
    const colorDebug = [1.0,0.0,0.0,1.0];
    //additional scaling on per block basis
    const b3 = 3.0;
    const b5 = 5.0;
    const b7 = 7.0;
    const b9 = 9.0;
    const b11 = 11.0;
    const b13 = 13.0;
    const b15 = 15.0;//max vertical
    const b17 = 17.0;
    const b19 = 19.0;
    const b21 = 21.0;
    //rows starting from origin (middle of plane), 
    //negate row values for lower half of plane
    const r0 = 0.0;
    const r1 = 1.5;
    const r2 = 3.0;
    const r3 = 4.5;
    const r4 = 6.0;
    const r5 = 7.5;
    const r6 = 9.0;
    const r7 = 10.5;
    //columns starting from origin (middle of plane),
    //negate column values for left half of plane
    const c0 = 0.0;
    const c1 = 1.5;
    const c2 = 3.0;
    const c3 = 4.5
    const c4 = 6.0;
    const c5 = 7.5;
    const c6 = 9.0;
    const c7 = 10.5;
    const c8 = 12.0;
    const c9 = 13.5;
    const c10 = 15.0;
    const global = new Global();
    let selected_shader = 0;
    const shaders = [new Shader("phong")];
    //const defaultShader = new Shader("gouraud");
    const parser = new OBJParser();
    const objects = [];
    let walls = [];
    let dots = [];
    let selected = -1;

    var pacmanShape = new PacmanShapeController();
    var ghostShapes = [new GhostShape('Red'),new GhostShape()];

    //manage drawcalls and starting position for pacman shape
    objects.push(pacmanShape);
    objects[0].rotate("x",180);
    objects[0].rotate("z",270);
    
    //Labyrinth floor
    objects.push(await parser.parseObjectFromFile('./sampleModels/plane.obj',colorPlane));
    objects[1].scale(16.5,12.0);
    objects[1].translate(u,u,-0.5);

    for (let i = 0; i < ghostShapes.length; i++) {
        objects.push(ghostShapes[i]);
    }
        

    const createLabyrinth = async () => {
        //create Labyrinth

        
        //Borders
        let temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);

        temp.scale(...defaultScale);
        temp.scale(u,b15);
        temp.translate(c10,r0);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.scale(u,b15);
        temp.translate(-c10,r0);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.scale(b21);
        temp.translate(c0,r7);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.scale(b21);
        temp.translate(c0,-r7);
        walls.push(temp);

        //structure 1
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(-c7,r6);
        temp.scale(b3);
        walls.push(temp);

        //structure 2
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.scale(b3,b3);
        temp.translate(-c2,r4);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(c0,r5);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(c1,r5);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(c0,r6);
        walls.push(temp);

        //structure 3
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(c4,r6);
        temp.scale(b3);
        walls.push(temp);

        //structure 4
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(-c9,r0);
        temp.scale(u,b7);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(-c8,r2);
        walls.push(temp);

        //structure 5
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(-c6,r4);
        temp.scale(b3);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(-c6,r2);
        temp.scale(u,b3);
        walls.push(temp);

        //structure 6
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(c1,r2);
        temp.scale(u,b3);
        walls.push(temp);

        //structure 7
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(c4,r3);
        temp.scale(b3,b3);
        walls.push(temp);

        //structure 8
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(c7,r2);
        temp.scale(u,b7);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(c8,r4);
        temp.scale(u,b3);
        walls.push(temp);

        //structure 9
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(-c7,-r3);
        temp.scale(u,b5);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(-c4,-r5);
        temp.scale(b5);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(-c6,-r3);
        temp.scale(u,b3);
        walls.push(temp);

        //structure 10
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(-c4,-r0);
        temp.scale(u,b3);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(-c3,-r1);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(-c2,r1);
        temp.scale(b3);
        walls.push(temp);

        //structure 11
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(c1,-r1);
        temp.scale(b5);
        walls.push(temp);


        //structure 12
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(c5,-r3);
        temp.scale(b3);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(c7,-r3);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(c5,-r1);
        temp.scale(u,b3);
        walls.push(temp);


        //structure 13
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(c9,-r2);
        temp.scale(u,b7);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(c8,-r5);
        walls.push(temp);


        //structure 14
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(-c9,-r6);
        walls.push(temp);    

        

        //structure 15
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(-c1,-r3);
        temp.scale(b7);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(c0,-r4);
        walls.push(temp);

        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall2);
        temp.scale(...defaultScale);
        temp.translate(c0,-r5);
        walls.push(temp);

        //structure 16
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(c4,-r5);
        temp.scale(b5);
        walls.push(temp);
        
        temp = await parser.parseObjectFromFile('./sampleModels/cube.obj',colorWall1);
        temp.scale(...defaultScale);
        temp.translate(c4,-r6);
        walls.push(temp);

        return walls;
    }

    objects.push(...await createLabyrinth());

    const instantiateDotColumn = async (fromRow,toRow, column) => {
        //to prevent input order problems 
        if(fromRow > toRow) {
            let tmp = toRow;
            toRow = fromRow;
            fromRow = tmp;
        }
        for(let i = fromRow; i < toRow+1; i += 1.5) {
            let temp = await parser.parseDot('./sampleModels/Pacman/Dot.obj',colorPacman);

            temp.translate(column,i);
            dots.push(temp);
        }
    } 

    const instantiateDotRow = async (fromCol,toCol, row) => {
        //to prevent input order problems 
        if(fromCol > toCol) {
            let tmp = toCol;
            toCol = fromCol;
            fromCol = tmp;
        }
        for(let i = fromCol; i < toCol+1; i += 1.5) {
            let temp = await parser.parseDot('./sampleModels/Pacman/Dot.obj',colorPacman);

            temp.translate(i,row);
            dots.push(temp);
        }
    }
    
    const instantiateLabyrinthDots = async () => {
        await instantiateDotColumn(r4,r6,-c9);
        await instantiateDotColumn(-r4,-r5,-c9);
        await instantiateDotColumn(r5,r3,-c8);
        await instantiateDotColumn(-r6,r1,-c8);
        await instantiateDotRow(-c7,-c4,r5);
        await instantiateDotColumn(r3,r0,-c7);
        await instantiateDotRow(-c7,c3,-r6);
        await instantiateDotColumn(r0,-r1,-c6);
        await instantiateDotRow(-c5,-c1,r6);
        await instantiateDotColumn(r3,-r4,-c5);
        await instantiateDotColumn(r4,r2,-c4);
        await instantiateDotRow(-c4,c4,-r2);
        await instantiateDotRow(-c4,-c1,-r4);
        await instantiateDotRow(-c3,c0,r2);
        await instantiateDotRow(-c3,-c1,r0);
        await instantiateDotRow(-c2,-c2,-r1);
        await instantiateDotRow(-c1,-c1,-r5);
        await instantiateDotColumn(r4,r3,c0);
        await instantiateDotColumn(r1,r1,c0);
        await instantiateDotRow(c1,c2,r6);
        await instantiateDotRow(c1,c2,r4);
        await instantiateDotRow(c1,c4,r0);
        await instantiateDotRow(c1,c8,-r4);
        await instantiateDotRow(c1,c1,-r5);
        await instantiateDotRow(c2,c6,r5);
        await instantiateDotColumn(r3,r1,c2);
        await instantiateDotRow(c3,c6,r1);
        await instantiateDotRow(c3,c3,-r3);
        await instantiateDotRow(c4,c4,-r1);
        await instantiateDotRow(c5,c9,-r6);
        await instantiateDotRow(c6,c9,r6);
        await instantiateDotColumn(r4,r2,c6);
        await instantiateDotColumn(r0,-r2,c6);
        await instantiateDotRow(c7,c7,-r2);
        await instantiateDotRow(c7,c7,-r5);
        await instantiateDotColumn(r2,-r3,c8);
        await instantiateDotColumn(r5,r2,c9);
    }

    await instantiateLabyrinthDots();

    objects.push(...dots);

    const ghosts = [new Ghost(ghostShapes[0], walls, [c3,r1]),new Ghost(ghostShapes[1], walls, [-c4,r2])];
    const pacman = new Pacman(global,pacmanShape, walls, ghosts);
    


    var canvas = document.querySelector("#c");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }


    for (let i = 0; i < shaders.length; i++) {
        await shaders[i].init(gl);

        //prepare vertices and faces
        global.initGlobalCoordinateSystem(gl,shaders[i]);

        for (let j = 0; j < objects.length; j++) {
            await objects[j].init(gl, shaders[i]);
        }
    }

    function onResize(entries) {

        for (const entry of entries) {
            if (entry.devicePixelContentBoxSize) {
                canvas.width = entry.devicePixelContentBoxSize[0].inlineSize;
                canvas.height = entry.devicePixelContentBoxSize[0].blockSize;
                
                if(!global.projectionMatrixInitDone) {
                    global.initProjectionMatrix(entry.devicePixelContentBoxSize[0].inlineSize,entry.devicePixelContentBoxSize[0].blockSize);
                }
            }
        }
    }

    //handles zooming
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas, {box: 'device-pixel-content-box'});
    
    //Keyboard input listeners
    document.addEventListener("keydown",function(event) {
        if(!(isNaN(event.key) || isNaN(parseFloat(event.key)))) {
            selected = parseFloat(event.key);
        } else {
            switch(event.key) {
                case 'ArrowRight':
                    pacman.translate(3);
                    break;
                case 'ArrowLeft':
                    pacman.translate(4);
                    break;
                case 'ArrowUp':
                    pacman.translate(1);
                    break;
                case 'ArrowDown':
                    pacman.translate(2);
                    break;
                case 'v':
                    global.toggleShear();
                    break;
            }
        }
    });


    const draw = () => {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas and set background color
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clearDepth(1.0);
        
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.CULL_FACE);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(shaders[selected_shader].program);
        
        if(selected == 0) {
            global.drawGlobalCoordinateSystem(gl,shaders[selected_shader]);
        }

        for (var i = 0; i < objects.length; i++) {
            objects[i].draw(gl, shaders[selected_shader], global);
            if(selected > 0 && i == (selected-1)) {
                objects[i].drawCoordianteSystem(gl,shaders[selected_shader], global);
            }
        }

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}
    try{
     main();
    } catch(e) {

    }
