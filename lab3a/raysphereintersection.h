#ifndef RAY_SHPERE_INTERSECTION_H
#define RAY_SHPERE_INTERSECTION_H

#include "sphere.h"
#include "point3d.h"

//forward declaration to avoid circular dependencies
struct Ray3D;

struct RaySphereIntersection {
    Sphere* sphere;
    Ray3D* ray;
    Point3D intersection_point;
    long double t;

    RaySphereIntersection(Sphere* sphere, Ray3D* ray, Point3D intersection_point, long double t) : sphere{sphere}, ray{ray}, intersection_point{intersection_point} {}

};


#endif