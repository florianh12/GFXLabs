import { distance } from "../gl-matrix/dist/esm/vec3.js";
import { Shape } from "./shape.js";

export class OBJParser {
    min = [0.0,0.0,0.0];
    max = [0.0,0.0,0.0];
    maxDistance = 0.0;
    vertexMap = new Map();

    rawVertices = [];
    rawNormals = [];
    rawVertexIndices = [];
    rawNormalIndices = [];
    
    vertices = [];
    normals = [];
    indices = [];
    colors = [];

    reset() {
        this.min = [0.0,0.0,0.0];
        this.max = [0.0,0.0,0.0];
        this.vertexMap = new Map();

        this.rawVertices = [];
        this.rawNormals = [];
        this.rawVertexIndices = [];
        this.rawNormalIndices = [];
        
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.colors = [];
    }

    async parseObjectFromFile(filePath) {
       return this.parseObjectFromString(await (fetch(filePath).then(file => file.text())));
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
    parseFace(line) {
        for (let i = 1; i < line.length; i++) {
            const [vertexIndex,,normalIndex] = line[i].split('/').map(Number);

            this.rawVertexIndices.push(vertexIndex-1);
            this.rawNormalIndices.push(normalIndex-1);
        }
    }

    normalize() {
        const xOffset = (this.max[0] + this.min[0])/2;
        const yOffset = (this.max[1] + this.min[1])/2;
        const zOffset = (this.max[2] + this.min[2])/2;

        const xScale = 1.0/(this.max[0] - this.min[0]);
        const yScale = 1.0/(this.max[1] - this.min[1]);
        const zScale = 1.0/(this.max[2] - this.min[2]);

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

    generateIndicesFromMap() {
        for(let i = 0; i < this.rawVertexIndices.length; i++) {
            const indicesString = `${this.rawVertexIndices[i]},${this.rawNormalIndices[i]}`;
            if (!this.vertexMap.has(indicesString)) {
                this.vertices.push(...this.rawVertices.slice(this.rawVertexIndices[i]*3, this.rawVertexIndices[i]*3 +3));
                this.normals.push(...this.rawNormals.slice(this.rawNormalIndices[i]*3,this.rawNormalIndices[i]*3+3));
                this.colors.push(...[0.0,1.0,1.0,1.0]);
                this.indices.push(this.vertexMap.size);
                this.vertexMap.set(indicesString,this.vertexMap.size);
            } else {
                this.indices.push(this.vertexMap.get(indicesString));
            }
        }
    }

    /**
     * 
     * @param {String} string 
     * 
     * @returns {Shape}
     */
    parseObjectFromString(string) {
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

        this.generateIndicesFromMap();
        console.log(this.rawVertices,this.rawVertexIndices,this.rawNormals,this.rawNormalIndices);
        console.log("After modification",this.vertices.length,this.normals.length,this.colors.length,this.indices.length,this.vertexMap.size)
        return new Shape(this.vertices,this.normals,this.colors,this.indices);
        
    }
}