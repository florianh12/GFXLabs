#ifndef SPHERE_H
#define SPHERE_H

#include "surface.h"
#include "material.h"

struct Sphere : Surface {
    long double radius;

    Sphere(Material material, Point3D position, long double radius);

    ~Sphere();
};


#endif //SPHERE_H