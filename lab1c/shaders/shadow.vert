#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// A matrix to transform the positions by
uniform mat4 u_projection_matrix;
uniform mat4 u_model_view_matrix;
//uniform mat4 u_shadow_matrix;


// a varying the color to the fragment shader

// all shaders have a main function
void main() {
    mat4 shadow_matrix = mat4(vec4(-5.0,0.0,0.0,0.0),
                            vec4(0.0,0.0,10.0,0.0),
                            vec4(0.0,0.0,0.0,0.0),
                            vec4(0.0,0.0,1.0,-10.0));    // Multiply the position by the model-view and projection matrices.
    gl_Position = u_projection_matrix * shadow_matrix * a_position;
}