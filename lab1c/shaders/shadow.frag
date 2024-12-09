#version 300 es

precision highp float;


// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {

    outColor = vec4(0.0,0.0,0.0,1.0);

    //outColor = v_texture_color;
}