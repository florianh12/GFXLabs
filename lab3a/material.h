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

    std::string toString(std::string offset = "") const {
        return offset+"Material{\n"+offset+"\tcolor: "+color.toString()+offset+"\tka: "+
        std::to_string(ka)+"\n"+offset+"\tkd: "+std::to_string(kd)+"\n"+offset+"\tks: "+
        std::to_string(ks)+"\n"+offset+"\texponent: "+std::to_string(exponent)+"\n"+offset+"}\n";
    }
};

inline std::ostream& operator<<(std::ostream& o, const Material& material) {
    o << material.toString();

    return o;
}


#endif //MATERIAL_H