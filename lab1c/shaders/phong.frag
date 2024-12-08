#version 300 es

precision highp float;

uniform vec4 u_light_position;

uniform vec4 u_light_specular;
uniform bool u_ambient;
uniform bool u_diffuse;
uniform bool u_specular;
uniform sampler2D u_shadow_map;

// the color, projected vertex position and normal passed from the vertex shader
in vec4 v_color;
in vec3 v_projected_position;
in vec3 v_projected_light_position;
in vec3 v_projected_normal;
// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
     //light direction according to vertex position
    vec3 light_direction = normalize(u_light_position.xyz - v_projected_position);
    vec3 normal = normalize(v_projected_normal);
    
    //scalar to regulate ambient light intensity
    
    

    //sets base value (a set to 1 after all additions anyways) to allow += operation
    outColor = vec4(0.0,0.0,0.0,1.0);

    //calculate and add activated light types to final color
    if(u_ambient) {
        //adjust ambient light intensity
        vec4 ambient = 0.2 * v_color;

        //add ambent part to final color
        outColor += ambient;
    }

    if(u_diffuse) {

        //calculate diffuse intensity and coefficient and adjust product accordingly
        float Kd = max(dot(light_direction,normal),0.0);
        vec4 diffuse = Kd * v_color * 0.9;

        //add diffuse part to final color
        outColor += diffuse;
    }

    if(u_specular) {
        //calculate necessary components for specular coefficient
        vec3 reflect_direction = reflect(-light_direction,normal);

        ////calculate specular intensity and adjust color accordingly
        float Ks = pow(max(dot(reflect_direction,normal),0.0),200.0);
        vec4 specular = Ks * u_light_specular * 0.4;

        //add ambient part to final color
        outColor += specular;
    }
    
    //Adjust final alpha value to 1.0
    outColor.a = 1.0;

    if(texture(u_shadow_map,v_projected_light_position.xy).r <= v_projected_position.z) {
        outColor = vec4(0.0,0.0,0.0,1.0);
    }

    //outColor = v_texture_color;
}