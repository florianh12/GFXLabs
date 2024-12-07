import { distance } from "../gl-matrix/dist/esm/vec3.js";
import { PacmanShape } from "./pacman-shape.js";
import { Shape } from "./shape.js";

export class OBJParser {
    min = [0.0,0.0,0.0];
    max = [0.0,0.0,0.0];
    maxDistance = 0.0;
    vertexMap = new Map();

    rawVertices = [];
    rawNormals = [];
    rawColors = [];
    rawVertexIndices = [];
    rawNormalIndices = [];
    rawColorIndices =[];
    
    vertices = [];
    normals = [];
    indices = [];
    colors = [];

    textureData = [];
    textureWidth = [];
    textureHeight = [];
    rawTextureColorCoordinates = [];
    textureColorCoordinates = [];

    reset() {
        this.min = [0.0,0.0,0.0];
        this.max = [0.0,0.0,0.0];
        this.vertexMap = new Map();

        this.rawVertices = [];
        this.rawNormals = [];
        this.rawColors = [];
        this.rawVertexIndices = [];
        this.rawNormalIndices = [];
        this.rawColorIndices = [];
        
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.colors = [];

        this.textureData = [];
        this.textureWidth = [];
        this.textureHeight = [];
        this.rawTextureColorCoordinates = [];
        this.textureColorCoordinates = [];
    }

    async parseObjectFromFile(filePath,color=[0.0,1.0,1.0,1.0]) {
       return this.parseObjectFromString(await (fetch(filePath).then(file => file.text())),color);
    }

    /**
     * 
     * @param {String[]} line 
     */
    parseVertex(line) {
        const [x, y, z] = line.slice(1,4).map(Number);

        if (this.max[0] < x) {
            this.max[0] = x;
        } else if (x < this.min[0]) {
            this.min[0] = x;
        }

        if (this.max[1] < y) {
            this.max[1] = y;
        } else if (y < this.min[1]) {
            this.min[1] = y;
        }

        if (this.max[2] < z) {
            this.max[2] = z;
        } else if (z < this.min[2]) {
            this.min[2] = z;
        }

        this.rawVertices.push(x);
        this.rawVertices.push(y);
        this.rawVertices.push(z);
    }

    /**
     * 
     * @param {String[]} line 
     */
    parseNormal(line) {
        const [x, y, z] = line.slice(1,4).map(Number);

        this.rawNormals.push(x);
        this.rawNormals.push(y);
        this.rawNormals.push(z);
    }

    /**
     * 
     * @param {String[]} line 
     */
    parseColor(line) {
        const [x, y] = line.slice(1,3).map(Number);
        
        this.rawTextureColorCoordinates.push(x);
        this.rawTextureColorCoordinates.push(y);
    }

    /**
     * 
     * @param {String[]} line 
     */
    parseFace(line) {
        for (let i = 1; i < line.length; i++) {
            const [vertexIndex,colorIndex,normalIndex] = line[i].split('/').map(Number);

            this.rawVertexIndices.push(vertexIndex-1);
            this.rawNormalIndices.push(normalIndex-1);
            this.rawColorIndices.push(colorIndex-1);
        }
    }

    normalize() {
        const xOffset = (this.max[0] + this.min[0])/2;
        const yOffset = (this.max[1] + this.min[1])/2;
        const zOffset = (this.max[2] + this.min[2])/2;

        const xScale = (this.max[0] - this.min[0]) ? 1.0/(this.max[0] - this.min[0]) : 1.0;
        const yScale = (this.max[1] - this.min[1]) ? 1.0/(this.max[1] - this.min[1]) : 1.0;
        const zScale = (this.max[2] - this.min[2]) ? 1.0/(this.max[2] - this.min[2]) : 1.0;

        const scalar = Math.max(xScale,yScale,zScale);

        for (let i = 0; i < this.rawVertices.length; i += 3) {
            this.rawVertices[i] -= xOffset;
            this.rawVertices[i + 1] -= yOffset;
            this.rawVertices[i + 2] -= zOffset;

            this.rawVertices[i] *= scalar;
            this.rawVertices[i + 1] *= scalar;
            this.rawVertices[i + 2] *= scalar;
        }
    }
    //simple alternative to generateIndicesFromMap
    combine() {
        for(let i = 0; i < this.rawVertexIndices.length; i++) {
            this.vertices.push(...this.rawVertices.slice(this.rawVertexIndices[i]*3, this.rawVertexIndices[i]*3 +3));
            this.normals.push(...this.rawNormals.slice(this.rawNormalIndices[i]*3,this.rawNormalIndices[i]*3+3));
            this.indices.push(i);
            this.colors.push(...[0.0,1.0,1.0,1.0]);
        }
    }

    generateIndicesFromMap(color,texture = false) {
        if(texture) {
            for(let i = 0; i < this.rawVertexIndices.length; i++) {
                const indicesString = `${this.rawVertexIndices[i]},${this.rawNormalIndices[i]},${this.rawColorIndices[i]}`;
                if (!this.vertexMap.has(indicesString)) {
                    this.vertices.push(...this.rawVertices.slice(this.rawVertexIndices[i]*3, this.rawVertexIndices[i]*3 +3));
                    this.normals.push(...this.rawNormals.slice(this.rawNormalIndices[i]*3,this.rawNormalIndices[i]*3+3));
                    this.colors.push(...color);
                    this.textureColorCoordinates.push(...this.rawTextureColorCoordinates.slice(this.rawColorIndices[i]*2,this.rawColorIndices[i]*2 + 2))
                    this.indices.push(this.vertexMap.size);
                    this.vertexMap.set(indicesString,this.vertexMap.size);
                } else {
                    this.indices.push(this.vertexMap.get(indicesString));
                }
            }
        } else {
            for(let i = 0; i < this.rawVertexIndices.length; i++) {
                const indicesString = `${this.rawVertexIndices[i]},${this.rawNormalIndices[i]}`;
                if (!this.vertexMap.has(indicesString)) {
                    this.vertices.push(...this.rawVertices.slice(this.rawVertexIndices[i]*3, this.rawVertexIndices[i]*3 +3));
                    this.normals.push(...this.rawNormals.slice(this.rawNormalIndices[i]*3,this.rawNormalIndices[i]*3+3));
                    this.colors.push(...color);
                    this.indices.push(this.vertexMap.size);
                    this.vertexMap.set(indicesString,this.vertexMap.size);
                } else {
                    this.indices.push(this.vertexMap.get(indicesString));
                }
            }
        }
    }

    /**
     * 
     * @param {String} string
     * @param {[]} color 
     * 
     * @returns {Shape}
     */
    parseObjectFromString(string,color) {
        //clear all values
        this.reset();

        //split string into lines
        const data = string.split('\n');

        for (let i = 0; i < data.length; i++) {
            const line = data[i].split(' ');

            if (line[0] == 'v') {
                this.parseVertex(line);

            } else if (line[0] == 'vn') {
                this.parseNormal(line);

            } else if (line[0] == 'f') {
                this.parseFace(line);
            }
        }

        this.normalize();

        this.generateIndicesFromMap(color);
        return new Shape(this.vertices,this.normals,this.colors,this.indices);
        
    }

    async parseTextureData(filePath) {
       //read in image as blob and convert it into bitmap
        let blob = await (fetch(filePath).then(file => file.blob()));
        let bitmap = await createImageBitmap(blob);
        
        //draw bitmap on offscreen canvas to retrieve data
        let canvas = new OffscreenCanvas(bitmap.width,bitmap.height);
        let context = canvas.getContext("2d");
        context.drawImage(bitmap,0,0);

        //get per pixel RGB color data
        let contextDataWrapper = context.getImageData(0,0,canvas.width,canvas.height);
        let data = contextDataWrapper.data;
        

        //normalize RGB data for WebGL format
        for (let i = 0; i < data.length; i++) {
            data[i] /= 255; 
        }


        //set object variables
        this.textureWidth = canvas.width;
        this.textureHeight = canvas.height;
        this.textureData = data;
        
    }

    async parsePacman(filePath,texture = true,color=[1.0,1.0,0.0,1.0]) {

        let string =  await (fetch(filePath).then(file => file.text()));
        

        //clear all values
        this.reset();
        //evtl, let 
        await this.parseTextureData('./sampleModels/Pacman/PacmanUpper.png');
        //split string into lines
        const data = string.split('\n');

        
        
        //console.log(await loadImage());

        for (let i = 0; i < data.length; i++) {
            const line = data[i].split(' ');

            if (line[0] == 'v') {
                this.parseVertex(line);

            } else if (line[0] == 'vn') {
                this.parseNormal(line);

            } else if (line[0] == 'vt' && texture) {
                this.parseColor(line);

            } else if (line[0] == 'f') {
                this.parseFace(line);
            }
        }

        this.generateIndicesFromMap(color, texture);
        return new PacmanShape(this.vertices,this.normals,this.colors,this.indices,this.textureColorCoordinates,texture);

     }
}