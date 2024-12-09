import { Global } from "./global.js";
import { Shader } from "./shader.js";
import { Shape } from "./shape.js";

export class Dot extends Shape {
    visibility = true;
    
    setVisibility(visibility) {
        this.visibility = visibility;
    }
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Shader} shader 
     * @param {Global} global 
     */
    draw(gl, shader, global) {
        if(this.visibility) {
            super.draw(gl,shader,global);
        }
    }

    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Shader} shader 
     * @param {Global} global 
     */
    shadowPass(gl, shader, global) {
        if(this.visibility) {
            super.shadowPass(gl,shader,global);
        }
    }
}