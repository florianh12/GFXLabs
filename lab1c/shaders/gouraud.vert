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
uniform mat4 u_light_projection_model_view_matrix;
uniform sampler2D u_shadow_map;



uniform vec4 u_light_specular;
uniform bool u_ambient;
uniform bool u_diffuse;
uniform bool u_specular;

// a varying the color to the fragment shader
out vec4 v_color;

// all shaders have a main function
void main() {
    
    vec4 light_space_position = u_light_projection_model_view_matrix * a_position;
    vec3 light_space_coordiantes = light_space_position.xyz / light_space_position.w;
    vec2 shadow_map_position;
    shadow_map_position.x = 0.5 * light_space_coordiantes.x + 0.5;
    shadow_map_position.y = 0.5 * light_space_coordiantes.y + 0.5;
    float z = 0.5 * light_space_coordiantes.z + 0.5;
    float map_depth = texture(u_shadow_map, shadow_map_position.xy).x;
    float bias = 0.0025;
    float shadow_factor = 1.0;

    if (map_depth + bias < z) {
        shadow_factor = 0.0;
    } else {
        shadow_factor = 1.0;
    }

    

    //projected positions/vectors (to eye space)
    vec3 projected_position = (u_model_view_matrix * a_position).xyz;
    vec3 projected_normal = normalize(u_normal_matrix * a_vertex_normal);
    
    //light direction according to vertex position
    vec3 light_direction = normalize(u_light_position.xyz - projected_position);
    
        
    

    //sets base value (a set to 1 after all additions anyways) to allow += operation
    v_color = vec4(0.0,0.0,0.0,1.0);

    //calculate and add activated light types to final color
    if(u_ambient) {
        //adjust ambient light intensity
        vec4 ambient = 0.2 * a_color;

        //add ambent part to final color
        v_color += ambient;
    }

    if(u_diffuse) {
        //calculate diffuse intensity and adjust product accordingly
        float Kd = max(dot(light_direction,projected_normal),0.0);
        vec4 diffuse = Kd * a_color * 0.8;

        //add diffuse part to final color
        v_color += diffuse * shadow_factor;
    }

    if(u_specular) {
        //calculate necessary components for specular coefficient
        vec3 reflect_direction = reflect(-light_direction,projected_normal);

        ////calculate specular intensity and adjust color accordingly
        float Ks = pow(max(dot(reflect_direction,projected_normal),0.0),40.0);
        vec4 specular = Ks * u_light_specular * 0.9;

        //add ambient part to final color
        v_color += specular * shadow_factor;
    }
    
    //Adjust final alpha value to 1.0
    v_color.a = 1.0;

    /*if (map_depth == 1.0)
        v_color = vec4(1.0,0.0,0.0,1.0);*/

    // Multiply the position by the model-view and projection matrices.
    gl_Position = u_projection_matrix * u_model_view_matrix * a_position;
}