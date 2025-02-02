#include "material.h"
#include "color.h"
#include <string>
#include <vector>
#include <iostream>
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"


Material::Material() : uses_texture{false}, texture{std::vector<Color>()} {}

Material::Material(Color color, long double ka, long double kd, long double ks, long double exponent, 
    long double reflectance, long double transmittance, long double refraction) : color{color}, ka{ka}, kd{kd}, 
    ks{ks}, exponent{exponent}, reflectance{reflectance}, transmittance{transmittance}, refraction{refraction}, uses_texture{false}, texture{std::vector<Color>()} {}

Material::Material(long double ka, long double kd, long double ks, long double exponent, 
    long double reflectance, long double transmittance, long double refraction, std::string texture_file) : color{Color()}, ka{ka}, kd{kd}, 
    ks{ks}, exponent{exponent}, reflectance{reflectance}, transmittance{transmittance}, refraction{refraction}, uses_texture{true}, texture{std::vector<Color>()} {
        int width, height, channels;

        unsigned char* image = stbi_load(texture_file.c_str(), &width, &height, &channels, 0);

        std::cout << texture_file << std::to_string(channels) << std::endl;
    }

std::string Material::toString(std::string offset) const {
        return offset+"Material{\n"+offset+"\tcolor: "+color.toString()+offset+"\tka: "+
        std::to_string(ka)+"\n"+offset+"\tkd: "+std::to_string(kd)+"\n"+offset+"\tks: "+
        std::to_string(ks)+"\n"+offset+"\texponent: "+std::to_string(exponent)+"\n"+
        offset+"\treflectance: "+std::to_string(reflectance)+"\n"+
        offset+"\ttransmittance: "+std::to_string(transmittance)+"\n"+
        offset+"\trefraction: "+std::to_string(refraction)+"\n"+
        offset+"\tuses_texture: "+std::to_string(uses_texture)+"\n"+offset+"}\n";
    }

std::ostream& operator<<(std::ostream& o, const Material& material) {
    o << material.toString();

    return o;
}