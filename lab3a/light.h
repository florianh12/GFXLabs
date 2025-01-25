#ifndef LIGHT_H
#define LIGHT_H

#include "color.h"
#include "vec3.h"

struct Light
{
    Color color;

    Light(Color color) : color{color} {}

    virtual Vec3 getDirection(Point3D point) = 0;

    virtual ~Light() = 0;
};

inline Light::~Light() {}

inline Vec3 Light::getDirection(Point3D point) { return Vec3(); }


#endif //LIGHT_H