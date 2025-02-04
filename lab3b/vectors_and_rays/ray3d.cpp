//my code
#include "ray3d.h"
#include "point3d.h"
#include "vec3.h"

//used libraries
#include <stdexcept>

//for no intersection in intersection class only
Ray3D::Ray3D() {}

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

bool Ray3D::operator==(const Ray3D& other) const {
    return origin == other.origin && direction == other.direction 
    && min_dist == other.min_dist && max_dist == other.max_dist;
}

std::string Ray3D::toString() const {
    return "Ray3D{\n\torigin: " + origin.toString() + 
    "\tdirection: "+direction.toString()+"\tmin_dist: "+ std::to_string(min_dist)+"\n"+
    "\tmax_dist: "+ std::to_string(max_dist)+"\n}\n";
}

std::ostream& operator<<(std::ostream& o, const Ray3D other) {
    o << other.toString();

    return o;
}