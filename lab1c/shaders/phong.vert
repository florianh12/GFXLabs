#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec4 a_color;
in vec2 a_texture_color_coordinate;
in vec3 a_vertex_normal;

// A matrix to transform the positions by
uniform mat4 u_projection_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_model_matrix;
uniform mat3 u_normal_matrix;
uniform sampler2D u_texture;
uniform bool u_texture_active;
uniform mat4 u_light_world_matrix;
uniform mat4 u_light_projection_matrix;



// a varying the color to the fragment shader
out vec4 v_color;
out vec3 v_projected_position;
out vec3 v_projected_normal;

// all shaders have a main function
void main() {
    
    if (u_texture_active) {
        v_color = texture(u_texture,a_texture_color_coordinate);
    }   else {
        v_color = a_color;
    }

    //projected positions/vectors (to eye space)
    v_projected_position = (u_view_matrix * u_model_matrix * a_position).xyz;
    v_projected_normal = normalize(u_normal_matrix * a_vertex_normal).xyz;
    
   

    // Multiply the position by the model-view and projection matrices.
    gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * a_position;
}