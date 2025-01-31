#ifndef SPHERE_H
#define SPHERE_H

#include "surface.h"
#include "material.h"
#include "point3d.h"

struct Sphere : Surface {
    long double radius;

    //for no intersection in intersection class only
    Sphere();

    Sphere(Material material, Point3D position, long double radius);

    ~Sphere();
};


#endif //SPHERE_H