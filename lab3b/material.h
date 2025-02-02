#ifndef MATERIAL_H
#define MATERIAL_H

#include "color.h"
#include <string>
#include <vector>
#include <iostream>

struct Material
{
    Color color;
    long double ka;
    long double kd;
    long double ks;
    long double exponent;
    long double reflectance;
    long double transmittance;
    long double refraction;

    bool uses_texture;

    std::vector<Color> texture;

    //for no intersection in intersection class only
    Material();

    Material(Color color, long double ka, long double kd, long double ks, long double exponent, 
    long double reflectance, long double transmittance, long double refraction);

    Material(long double ka, long double kd, long double ks, long double exponent, 
    long double reflectance, long double transmittance, long double refraction, 
    std::string texture_file);

    std::string toString(std::string offset = "") const;
};

inline std::ostream& operator<<(std::ostream& o, const Material& material);


#endif //MATERIAL_H