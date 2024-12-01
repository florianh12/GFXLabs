#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// A light transformation matrix
uniform mat4 u_light_projection_model_view_matrix;


// all shaders have a main function
void main() {
        
        

    // transformed positions
    gl_Position = u_light_projection_model_view_matrix * a_position;
}