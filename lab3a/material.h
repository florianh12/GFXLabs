#ifndef MATERIAL_H
#define MATERIAL_H

#include "color.h"
#include <string>

struct Material
{
    Color color;
    long double ka;
    long double kd;
    long double ks;
    long double exponent;

    //for no intersection in intersection class only
    Material() {}

    Material(Color color, long double ka, long double kd, long double ks, long double exponent) : color{color}, ka{ka}, kd{kd}, ks{ks}, exponent{exponent} {}

    std::string toString() const {
        return "Material{\n\tcolor: "+color.toString()+"\tka: "+
        std::to_string(ka)+"\n\tkd: "+std::to_string(kd)+"\n\tks: "+
        std::to_string(ks)+"\n\texponent: "+std::to_string(exponent)+"\n}\n";
    }
};

std::ostream& operator<<(std::ostream& o, const Material& material) {
    o << material.toString();

    return o;
}


#endif