#ifndef POINTLIGHT_H
#define POINTLIGHT_H

#include "vec3.h"
#include "color.h"
#include "light.h"
#include "point3d.h"

#include <iostream>


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

    std::string toString() const {
        return "PointLight{\n\tcolor: " + color.toString() + 
        "\tposition: " + position.toString() + "}\n";
    }

    ~PointLight() {}
};

inline std::ostream& operator<<(std::ostream& o, const PointLight& light) {
    o << light.toString();

    return o;
}


#endif //POINTLIGHT_H