import { Shape } from "./shape.js";

export class OBJParser {
    min = [0.0,0.0,0.0];
    max = [0.0,0.0,0.0];
    vertices = [];
    colors = [];
    indices = [];
    normals = [];

    reset() {
        this.min = [0.0,0.0,0.0];
        this.max = [0.0,0.0,0.0];
        this.vertices = [];
        this.normals = [];
        this.colors = [];
        this.indices = [];
    }   

    async parseObjectFromFile(filePath) {
       return this.parseObjectFromString(await (fetch(filePath).then(file => file.text())));
    }

    parseObjectFromString(string, normalize = false) {
        
        this.reset();

        const fileData = string.split("\n");

        let objectCounter = 0;

        for(let i = 0; i < fileData.length; i++) {
            if(fileData[i][0] == 'o') {
                if(objectCounter < 1) {
                    objectCounter += 1;
                    continue;
                } else {
                    throw Error("Too many objects in file");
                }
            } else if( fileData[i][0] == 'v') {
                if(fileData[i][1] == ' ') {
                    this.parseVertex(fileData[i]);
                } else if (fileData[i][1] == 'n') {
                    this.parseNormal(fileData[i]);
                }
                
            } else if(fileData[i][0] == 'f') {
                this.parseFace(fileData[i]);
            }
        }
        
        this.processVertices(normalize);

        return new Shape(this.vertices,this.normals,this.colors,this.indices);
    }

    parseVertex(line) {
        line = line.split(' ');

        const vertex = [
            parseFloat(line[1]),
            parseFloat(line[2]),
            parseFloat(line[3])];
        
        for(let j = 0; j < vertex.length; j++) {
            if(vertex[j] < this.min[j]) {
                this.min[j] = vertex[j];
            } else if (vertex[j] > this.max[j]) {
                this.max[j] = vertex[j];
            }
        }

        this.vertices.push(...vertex);
        this.colors.push(...[0.0,1.0,1.0,1.0]);
    }

    parseNormal(line) {
        line = line.split(' ');

        const normal = [
            parseFloat(line[1]),
            parseFloat(line[2]),
            parseFloat(line[3])];

        this.normals.push(...normal);
    }

    parseFace(line) {
        line = line.split(' ');
                
        for(let j = 1; j < line.length; j++) {
            this.indices.push((parseInt(line[j].split('/')[0])-1));
        }
    }

    processVertices(normalize) {
        const scalingFactor = Math.max(...this.max.map((value, index) => { return 1.0 / (value - this.min[index])}));

        for(let i = 0; i < this.vertices.length; i++) {
            if(normalize) {
                this.vertices[i] -= (this.min[i%3] + ((this.max[i%3]-this.min[i%3])/2));
            }
            this.vertices[i] *= scalingFactor;
        }
    }
}