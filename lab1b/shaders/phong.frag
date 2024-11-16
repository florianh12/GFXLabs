#version 300 es

precision highp float;

uniform vec4 u_light_position;

uniform vec4 u_light_ambient;
uniform vec4 u_light_diffuse;
uniform vec4 u_light_specular;
uniform bool u_ambient;
uniform bool u_diffuse;
uniform bool u_specular;

// the color, projected vertex position and normal passed from the vertex shader
in vec4 v_color;
in vec3 v_projected_position;
in vec3 v_projected_normal;
// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
     //light direction according to vertex position
    vec3 light_direction = normalize(u_light_position.xyz - v_projected_position);
    
    
    //scalar to regulate ambient light intensity
    
    

    //sets base value (a set to 1 after all additions anyways) to allow += operation
    outColor = vec4(0.0,0.0,0.0,1.0);

    //calculate and add activated light types to final color
    if(u_ambient) {
        //mix light source ambient with object color
        vec4 ambient_product = u_light_ambient * v_color;

        //adjust ambient light intensity
        vec4 ambient = 1.0 * ambient_product;

        //add ambent part to final color
        outColor += ambient;
    }

    if(u_diffuse) {
        //mix light source diffuse with object color
        vec4 diffuse_product = u_light_diffuse * v_color;

        //calculate diffuse intensity and adjust product accordingly
        float Kd = max(dot(light_direction,v_projected_normal),0.0);
        vec4 diffuse = Kd * diffuse_product;

        //add diffuse part to final color
        outColor += diffuse;
    }

    if(u_specular) {
        //calculate necessary components for specular coefficient
        vec3 view_direction = normalize(-v_projected_position);
        vec3 half_direction = normalize(view_direction + light_direction);

        ////calculate specular intensity and adjust color accordingly
        float Ks = pow(max(dot(half_direction,v_projected_normal),0.0),100.0);
        vec4 specular = Ks * u_light_specular;

        //add ambient part to final color
        outColor += specular;
    }
    
    //Adjust final alpha value to 1.0
    outColor.a = 1.0;
}