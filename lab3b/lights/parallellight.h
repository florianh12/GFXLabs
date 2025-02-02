#ifndef PARALLELLIGHT_H
#define PARALLELLIGHT_H

#include "vec3.h"
#include "color.h"
#include "light.h"

//lib depenedencies
#include <limits>

struct ParallelLight : public Light
{
    Vec3 direction;

    ParallelLight(Color color, Vec3 direction) : Light{color}, direction{direction} {
        this->direction.normalize();
    }

    Vec3 getDirection(Point3D point) {
        return direction;
    }

    long double maxT(Point3D point) { return std::numeric_limits<long double>::infinity();}

    std::string toString() const {
        return "ParallelLight{\n\tcolor: " + color.toString() + 
        "\tdirection: " + direction.toString() + "}\n";
    }

    ~ParallelLight() {}
};

inline std::ostream& operator<<(std::ostream& o, const ParallelLight& light) {
    o << light.toString();

    return o;
}


#endif //PARALLELLIGHT_H