#ifndef LIGHT_H
#define LIGHT_H

#include "color.h"
#include "vec3.h"
#include "point3d.h"

//lib depenedencies
#include <limits>
#include <string>

struct Light
{
    Color color;

    Light(Color color) : color{color} {}

    virtual Vec3 getDirection(Point3D point) = 0;

    virtual long double maxT(Point3D point) = 0;

    virtual ~Light() = 0;

    virtual std::string toString() const;
};

inline Light::~Light() {}

inline Vec3 Light::getDirection(Point3D point) { return Vec3(); }

inline long double Light::maxT(Point3D point) { return std::numeric_limits<long double>::infinity();}

inline std::string Light::toString() const { return color.toString(); }

inline std::ostream& operator<<(std::ostream& o, const Light& light) {
    o << light.toString();

    return o;
}


#endif //LIGHT_H