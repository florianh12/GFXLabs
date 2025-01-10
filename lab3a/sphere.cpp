#include "sphere.h"
#include <stdexcept>

Sphere::Sphere(Color color, Point3D position, long double radius) : Surface{color, position}, radius{radius} {
    if (radius <= 0.0L) {
        throw std::runtime_error("Sphere radius is smaller orequal to 0!");
    }

}

Sphere::~Sphere() {}