#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// A light transformation matrix
uniform mat4 u_light_view_projection_matrix;
uniform mat4 u_global_transformation_matrix;
uniform mat4 u_model_matrix;


// all shaders have a main function
void main() {
        
        

    // transformed positions
    gl_Position = u_light_view_projection_matrix * u_global_transformation_matrix * u_model_matrix * a_position;
}