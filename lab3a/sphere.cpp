//my code
#include "surface.h"
#include "sphere.h"
#include "material.h"
#include "point3d.h"
#include "raysphereintersection.h"

//used libraries
#include <stdexcept>

//for no intersection in intersection class only
Sphere::Sphere() {}

Sphere::Sphere(Material material, Point3D position, long double radius) : Surface{material, position}, radius{radius} {
    if (radius <= 0.0L) {
        throw std::runtime_error("Sphere radius is smaller orequal to 0!");
    }

}



Sphere::~Sphere() {}