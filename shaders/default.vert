#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec4 a_color;

// A matrix to transform the positions by
uniform mat4 u_view_matrix;
uniform mat4 u_projection_matrix;
uniform mat4 u_global_transformation_matrix;
uniform mat4 u_local_transformation_matrix;

// a varying the color to the fragment shader
out vec4 v_color;

// all shaders have a main function
void main() {
    // Multiply the position by the matrix.
    gl_Position = u_projection_matrix * u_view_matrix * u_global_transformation_matrix * u_local_transformation_matrix * a_position;

    // Pass the color to the fragment shader.
    v_color = a_color;
}