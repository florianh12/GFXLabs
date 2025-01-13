#ifndef MATERIAL_H
#define MATERIAL_H

#include "color.h"

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
};


#endif