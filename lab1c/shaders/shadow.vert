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

   vec3 lightdir = u_light_pos.xyz - vertex_model_pos.xyz;
   float dist_scalar = - vertex_model_pos.z / lightdir.z;
   float yp = vertex_model_pos.y + lightdir.y * dist_scalar;
   float xp = vertex_model_pos.x + lightdir.x * dist_scalar;
   vec4 shadow_pos = vec4(xp,yp,-0.5,1.0);

    gl_Position = u_projection_matrix * u_view_matrix * shadow_pos;
}