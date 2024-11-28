#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec4 a_color;
in vec4 a_vertex_normal;

// A matrix to transform the positions by
uniform mat4 u_view_matrix;
uniform mat4 u_projection_matrix;
uniform mat4 u_global_transformation_matrix;
uniform mat4 u_local_transformation_matrix;
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
    mat4 model_view_matrix = u_view_matrix * u_global_transformation_matrix * u_local_transformation_matrix;
    // vec4 material_ambient = vec4(1.0, 0.0, 1.0, 1.0);
    // vec4 material_diffuse = vec4(1.0, 0.8, 0.0, 1.0);
    // vec4 material_specular = vec4(1.0, 0.8, 0.0, 1.0);
    float material_shininess = 100.0;

    vec4 ambient_product = u_light_ambient * a_color;
    vec4 diffuse_product = u_light_diffuse * a_color;
    vec4 specular_product = u_light_specular;

    vec3 pos = (model_view_matrix * a_position).xyz;
    vec3 viewdir = normalize(-pos.xyz);
    vec3 light = u_light_position.xyz;
    vec3 lightdir = (light - pos);
    vec3 half_dir = normalize(viewdir + lightdir);

    mat4 normal_matrix = inverse(model_view_matrix);

    vec3 L = normalize(light - pos);

    vec3 E = normalize(-pos);
    

    //float d = dot(a_vertex_normal, u_light_position);
    vec3 N = normalize(transpose(inverse(mat3(model_view_matrix)))*a_vertex_normal.xyz);
    vec3 H = reflect(-L,N);

    vec4 ambient = ambient_product;
    
    float Kd = max(dot(L,N),0.0);
    vec4 diffuse = Kd * diffuse_product;

    float Ks = pow(max(dot(H,viewdir),0.0),200.0);
    vec4 specular = Ks * specular_product;
    

    v_color = ambient + diffuse + specular;
    v_color.a = 1.0;

    // Multiply the position by the matrix.
    gl_Position = u_projection_matrix * model_view_matrix * a_position;

    //vec3 light_vector = normalize(u_light_position.xyz - a_position.xyz);
    //vec3 view_vector = normalize(- a_position.xyz);
    //vec3 halfway_vector = normalize( (u_projection_matrix * u_view_matrix * model_matrix * vec4(light_vector,1.0)).xyz+  (u_projection_matrix * u_view_matrix * model_matrix * vec4(view_vector,1.0)).xyz);
    //vec3 transformed_vertex_normal = normalize(model_matrix * vec4(a_vertex_normal,1.0)).xyz;

    //float diffuse_scalar = max(dot(light_vector,a_vertex_normal),0.0);
    //float specular_scalar = pow(max(dot(transformed_vertex_normal,halfway_vector),0.0),5.0);
    // Pass the color to the fragment shader.
    
}