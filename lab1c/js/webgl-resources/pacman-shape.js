import * as glm from '../gl-matrix/dist/esm/index.js';
import { Shape } from "./shape.js";

export class PacmanShape extends Shape {

    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Shader} shader 
     * @param {Global} global 
     * @param {mat4} pacmanModelMatrix
     */
    draw(gl, shader, global, pacmanModelMatrix) {
        const adaptedModelMatrix = glm.mat4.create();

        glm.mat4.mul(adaptedModelMatrix,pacmanModelMatrix,this.modelMatrix);

        global.applyUniforms(gl,shader,adaptedModelMatrix);

        gl.bindVertexArray(this.vao);

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }

}