#ifndef LIGHT_H
#define LIGHT_H

#include "color.h"

struct Light
{
    Color col;

    Light(Color col) : col{col} {}

    virtual ~Light() = 0;
};

inline Light::~Light() {}



#endif //LIGHT_H