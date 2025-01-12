#ifndef MATERIAL_H
#define MATERIAL_H

#include "color.h"

struct Material
{
    Color color;
    long double kd;
    long double ks;
    long double exponent;

    Material(Color color, long double kd, long double ks, long double exponent) : color{color}, kd{kd}, ks{ks}, exponent{exponent} {}
};


#endif