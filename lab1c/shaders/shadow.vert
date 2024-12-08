#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// A matrix to transform the positions by
uniform mat4 u_model_matrix;
uniform mat4 u_light_world_matrix;
uniform mat4 u_light_projection_matrix;



// all shaders have a main function
void main() {
    
   

    // Multiply the position by the model-view and projection matrices.
    gl_Position = u_light_projection_matrix * u_light_world_matrix * u_model_matrix * a_position;
}