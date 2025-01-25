#ifndef POINTLIGHT_H
#define POINTLIGHT_H

#include "vec3.h"
#include "color.h"
#include "light.h"
#include "point3d.h"


struct PointLight : public Light
{
    Point3D position;

    PointLight(Color color, Point3D position): Light{color}, position{position} {}

    ~PointLight() {}
};



#endif //POINTLIGHT_H