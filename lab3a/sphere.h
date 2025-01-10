#ifndef SPHERE_H
#define SPHERE_H

#include "surface.h"

struct Sphere : Surface {
    long double radius;

    Sphere(Color color, Point3D position, long double radius);

    ~Sphere();
};


#endif //SPHERE_H