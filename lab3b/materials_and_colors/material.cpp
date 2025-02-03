#include "material.h"
#include "color.h"
#include <string>
#include <vector>
#include <iostream>
#include <stdexcept>
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"


Material::Material() : uses_texture{false}, texture{std::vector<Color>()} {}

Material::Material(Color color, long double ka, long double kd, long double ks, long double exponent, 
    long double reflectance, long double transmittance, long double refraction) : color{color}, ka{ka}, kd{kd}, 
    ks{ks}, exponent{exponent}, reflectance{reflectance}, transmittance{transmittance}, refraction{refraction}, uses_texture{false}, texture{std::vector<Color>()} {}

Material::Material(long double ka, long double kd, long double ks, long double exponent, 
    long double reflectance, long double transmittance, long double refraction, std::string texture_file) : color{Color(1,1,1)}, ka{ka}, kd{kd}, 
    ks{ks}, exponent{exponent}, reflectance{reflectance}, transmittance{transmittance}, refraction{refraction}, uses_texture{true}, texture{std::vector<Color>()} {
        int channels;

        unsigned char* image = stbi_load(texture_file.c_str(), &width, &height, &channels, 0);

        for(size_t i = 0; i < width * height * channels; i += 3) {
            texture.push_back(Color((static_cast<long double>(image[i]) / 255.0L), 
            (static_cast<long double>(image[i+1]) / 255.0L), 
            (static_cast<long double>(image[i+2]) / 255.0L)));
                
        }
    }

Color Material::getColor(int u, int v) {
    //return color at uv coordinates if object uses texture
    if (uses_texture) {
        return texture[((width*v) + u)];
    }
    
    return color;
}

std::string Material::toString(std::string offset) const {
        return offset+"Material{\n"+offset+"\tcolor: "+color.toString()+offset+"\tka: "+
        std::to_string(ka)+"\n"+offset+"\tkd: "+std::to_string(kd)+"\n"+offset+"\tks: "+
        std::to_string(ks)+"\n"+offset+"\texponent: "+std::to_string(exponent)+"\n"+
        offset+"\treflectance: "+std::to_string(reflectance)+"\n"+
        offset+"\ttransmittance: "+std::to_string(transmittance)+"\n"+
        offset+"\trefraction: "+std::to_string(refraction)+"\n"+
        offset+"\tuses_texture: "+std::to_string(uses_texture)+"\n"+
        offset+"\ttexture size: "+std::to_string(texture.size())+"\n"+offset+"}\n";
    }

std::ostream& operator<<(std::ostream& o, const Material& material) {
    o << material.toString();

    return o;
}