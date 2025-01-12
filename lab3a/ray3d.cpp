#include "ray3d.h"
#include "point3d.h"
#include "vec3.h"
#include <stdexcept>
#include <cmath>
//#include <optional> for some reason does not import std::optional

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

RaySphereIntersection* Ray3D::intersect(Sphere& sphere) {
   long double disc = std::sqrt(std::pow(direction*(origin - sphere.position),2)
    - ((direction*direction)*((origin-sphere.position)*(origin-sphere.position)-std::pow(sphere.radius,2))));
    
    if (disc < 0) {
        throw std::runtime_error("No intersection between Sphere and ray!");
    }

    long double t = -(direction*(origin-sphere.position));
    
    if (disc != 0) {

            t -= disc;
    }

    return new RaySphereIntersection(&sphere,&(*this),calculatePoint(t), t);

}