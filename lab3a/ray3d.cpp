#include "ray3d.h"
#include "point3d.h"
#include "vec3.h"
#include <stdexcept>

Ray3D::Ray3D(Point3D origin, Vec3 direction, long double min_dist, long double max_dist) : origin{origin}, direction{direction}, min_dist{min_dist}, max_dist{max_dist} {
    direction.normalize();
}

//calculates a point on the ray
Point3D Ray3D::calculatePoint(long double t) {
    if(t < min_dist) {
        throw std::runtime_error("t is smaller than min_dist");
    }

    if (t > max_dist) {
        throw std::runtime_error("t is larger than max_dist");
    }

    return origin + t * direction;
}