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

    Vec3 getDirection(Point3D point) {
        Vec3 dir = point - position;
        
        //normalize calculated light direction
        dir.normalize();

        return dir;
    }

    //stop shadow ray when reaching light source
    long double maxT(Point3D point) {
        return (point - position).vec_norm();
    }

    ~PointLight() {}
};



#endif //POINTLIGHT_H