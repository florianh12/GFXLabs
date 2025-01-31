#ifndef LIGHT_H
#define LIGHT_H

#include "color.h"

struct Light
{
    Color color;

    Light(Color color) : color{color} {}

    virtual ~Light() = 0;
};

inline Light::~Light() {}



#endif //LIGHT_H