#include "sphere.h"
#include <stdexcept>
#include "raysphereintersection.h"
#include <cmath>


Sphere::Sphere(Material material, Point3D position, long double radius) : Surface{material, position}, radius{radius} {
    if (radius <= 0.0L) {
        throw std::runtime_error("Sphere radius is smaller orequal to 0!");
    }

}



Sphere::~Sphere() {}