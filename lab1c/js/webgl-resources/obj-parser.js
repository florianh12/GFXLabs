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

    new_object = true;
    xOffset = 0;
    yOffset = 0;
    zOffset = 0;

    xScale = 0;
    yScale = 0;
    zScale = 0;

    indexOffset = 0;

    #reset() {
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
        //animation properties
        this.new_object = true;
        this.xOffset = 0;
        this.yOffset = 0;
        this.zOffset = 0;

        this.xScale = 0;
        this.yScale = 0;
        this.zScale = 0;
        this.indexOffset = 0;
    }

    async parseObjectFromFile(filePath) {
       return this.parseObjectFromString(await (fetch(filePath).then(file => file.text())));
    }

    async parseAnimationFromFiles(frame_count,filePath) {
        let obj_strings = [];
        for(let i = 0; i < this.frame_count; i++) {
            obj_strings.push(await (fetch(this.filename+String(i+1)+'.obj').then(file => file.text())));   
        } 

        return this.#parseAnimationFromString(obj_strings);
     }

    /**
     * 
     * @param {String[]} line 
     */
    #parseVertex(line) {
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
    #parseNormal(line) {
        const [x, y, z] = line.slice(1,4).map(Number);

        this.rawNormals.push(x);
        this.rawNormals.push(y);
        this.rawNormals.push(z);
    }

    /**
     * 
     * @param {String[]} line 
     */
    #parseFace(line) {
        for (let i = 1; i < line.length; i++) {
            const [vertexIndex,,normalIndex] = line[i].split('/').map(Number);

            this.rawVertexIndices.push(vertexIndex-1);
            this.rawNormalIndices.push(normalIndex-1);
        }
    }

    #normalize() {
        if(this.new_object) {
            this.xOffset = (this.max[0] + this.min[0])/2;
            this.yOffset = (this.max[1] + this.min[1])/2;
            this.zOffset = (this.max[2] + this.min[2])/2;

            this.xScale = 1.0/(this.max[0] - this.min[0]);
            this.yScale = 1.0/(this.max[1] - this.min[1]);
            this.zScale = 1.0/(this.max[2] - this.min[2]);
        }

        const scalar = Math.max(this.xScale,this.yScale,this.zScale);

        for (let i = 0; i < this.rawVertices.length; i += 3) {
            this.rawVertices[i] -= this.xOffset;
            this.rawVertices[i + 1] -= this.yOffset;
            this.rawVertices[i + 2] -= this.zOffset;

            this.rawVertices[i] *= scalar;
            this.rawVertices[i + 1] *= scalar;
            this.rawVertices[i + 2] *= scalar;
        }
    }
    //simple alternative to generateIndicesFromMap
    #combine() {
        for(let i = 0; i < this.rawVertexIndices.length; i++) {
            this.vertices.push(...this.rawVertices.slice(this.rawVertexIndices[i]*3, this.rawVertexIndices[i]*3 +3));
            this.normals.push(...this.rawNormals.slice(this.rawNormalIndices[i]*3,this.rawNormalIndices[i]*3+3));
            this.indices.push(i);
            this.colors.push(...[0.0,1.0,1.0,1.0]);
        }
    }

    #generateIndicesFromMap() {
        this.vertexMap.clear();
        for(let i = 0; i < this.rawVertexIndices.length; i++) {
            const indicesString = `${this.rawVertexIndices[i]},${this.rawNormalIndices[i]}`;
            if (!this.vertexMap.has(indicesString)) {
                this.vertices.push(...this.rawVertices.slice(this.rawVertexIndices[i]*3, this.rawVertexIndices[i]*3 +3));
                this.normals.push(...this.rawNormals.slice(this.rawNormalIndices[i]*3,this.rawNormalIndices[i]*3+3));
                this.colors.push(...[0.0,1.0,1.0,1.0]);
                this.indices.push(this.vertexMap.size+this.indexOffset);
                this.vertexMap.set(indicesString,this.vertexMap.size+this.indexOffset);
            } else {
                this.indices.push(this.vertexMap.get(indicesString));
            }
        }
        this.indexOffset += this.vertexMap.size;
    }

    /**
     * 
     * @param {String} string 
     * 
     * @returns {Shape}
     */
    parseObjectFromString(string) {
        //clear all values
        this.#reset();

        //split string into lines
        const data = string.split('\n');

        for (let i = 0; i < data.length; i++) {
            const line = data[i].split(' ');

            if (line[0] == 'v') {
                this.#parseVertex(line);

            } else if (line[0] == 'vn') {
                this.#parseNormal(line);

            } else if (line[0] == 'f') {
                this.#parseFace(line);
            }
        }

        this.#normalize();

        this.#generateIndicesFromMap();
        return new Shape(this.vertices,this.normals,this.colors,this.indices);
        
    }

    /**
     * 
     * @param {String[]} strings 
     * 
     * @returns {[Float32Array,Float32Array,Uint16Array]}
     */
    #parseAnimationFromString(strings) {
        //clear all values
        this.#reset();

        for (let i = 0; i < strings.length; i++) {
            //split string into lines
            const data = strings[i].split('\n');

            for (let i = 0; i < data.length; i++) {
                const line = data[i].split(' ');

                if (line[0] == 'v') {
                    this.#parseVertex(line);

                } else if (line[0] == 'vn') {
                    this.#parseNormal(line);

                } else if (line[0] == 'f') {
                    this.#parseFace(line);
                }
            }

            this.#normalize();

            if(this.new_object) {
                this.new_object = false;
            }

            this.#generateIndicesFromMap();
        } 
        
        return [this.vertices,this.normals,this.colors,this.indices];
        
    }
}