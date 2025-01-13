#include "ray3d.h"
#include "point3d.h"
#include "vec3.h"
#include <stdexcept>
#include <cmath>
#include <iostream>
//#include <optional> for some reason does not import std::optional

Ray3D::Ray3D(Point3D origin, Vec3 direction, long double min_dist, long double max_dist) : origin{origin}, direction{direction}, min_dist{min_dist}, max_dist{max_dist} {
    this->direction.normalize();
}

//calculates a point on the ray
Point3D Ray3D::calculatePoint(const long double t) const {
    if(t < min_dist) {
        throw std::runtime_error("t is smaller than min_dist t:"+std::to_string(t));
    }

    if (t > max_dist) {
        throw std::runtime_error("t is larger than max_dist");
    }
    return origin + t * direction;
}

