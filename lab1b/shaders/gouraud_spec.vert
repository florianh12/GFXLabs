#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec4 a_color;
in vec3 a_vertex_normal;

// A matrix to transform the positions by
uniform mat4 u_projection_matrix;
uniform mat4 u_model_view_matrix;
uniform mat3 u_normal_matrix;
uniform vec4 u_light_position;

uniform vec4 u_light_ambient;
uniform vec4 u_light_diffuse;
uniform vec4 u_light_specular;
uniform bool u_gouraud;
uniform bool u_specular;

// a varying the color to the fragment shader
out vec4 v_color;

// all shaders have a main function
void main() {
    // vec4 material_ambient = vec4(1.0, 0.0, 1.0, 1.0);
    // vec4 material_diffuse = vec4(1.0, 0.8, 0.0, 1.0);
    // vec4 material_specular = vec4(1.0, 0.8, 0.0, 1.0);
    float material_shininess = 100.0;

    vec4 ambient_product = u_light_ambient * a_color;
    vec4 diffuse_product = u_light_diffuse * a_color;
    vec4 specular_product = u_light_specular;
    //projected positions/vectors (to eye space)
    vec3 projected_position = (u_model_view_matrix * a_position).xyz;
    vec3 projected_normal = normalize(u_normal_matrix * a_vertex_normal);
    
    vec3 light_direction = normalize(u_light_position.xyz - projected_position);
    vec3 view_direction = normalize(-projected_position);
    vec3 half_direction = normalize(view_direction + light_direction);
    
    //scalar to regulate ambient light intensity
    vec4 ambient = 1.0 * ambient_product;
    
    float Kd = max(dot(light_direction,projected_normal),0.0);
    vec4 diffuse = Kd * diffuse_product;

    float Ks = pow(max(dot(half_direction,projected_normal),0.0),200.0);
    vec4 specular = Ks * specular_product;
    

    v_color = ambient + diffuse + specular;
    v_color.a = 1.0;

    // Multiply the position by the matrix.
    gl_Position = u_projection_matrix * u_model_view_matrix * a_position;
}