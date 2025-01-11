#ifndef RAY_SHPERE_INTERSECTION_H
#define RAY_SHPERE_INTERSECTION_H

#include "sphere.h"
#include "ray3d.h"
#include "point3d.h"

struct RaySphereIntersection {
    Sphere* sphere;
    Ray3D* ray;
    Point3D intersection_point;

    RaySphereIntersection(Sphere* sphere, Ray3D* ray, Point3D intersection_point) : sphere{sphere}, ray{ray}, intersection_point{intersection_point} {}

};


#endif