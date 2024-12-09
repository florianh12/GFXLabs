#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// A matrix to transform the positions by
uniform mat4 u_projection_matrix;
uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
//uniform mat4 u_shadow_matrix;
uniform vec4 u_light_pos;


// a varying the color to the fragment shader

// all shaders have a main function
void main() {
    // Multiply the position by the model-view and projection matrices.
    vec4 vertex_model_pos = u_model_matrix * a_position;

    //Calculate light direction vector
    vec3 lightdir = u_light_pos.xyz - vertex_model_pos.xyz;

    //scale it according to vertex
    float dist_scalar = - vertex_model_pos.z / lightdir.z;

    //project x and y coordinates accordingly
    float y_shadow = vertex_model_pos.y + lightdir.y * dist_scalar;
    float x_shadow = vertex_model_pos.x + lightdir.x * dist_scalar;

    //-0.5 because my labyrinth floor is at -0.6 (a bit below to avoid clipping)
    vec4 shadow_pos = vec4(x_shadow,y_shadow,-0.5,1.0);

    gl_Position = u_projection_matrix * u_view_matrix * shadow_pos;
}