#ifndef RAY_SHPERE_INTERSECTION_H
#define RAY_SHPERE_INTERSECTION_H

#include "sphere.h"
#include "point3d.h"
#include "ray3d.h"

struct RaySphereIntersection {
    Sphere sphere;
    Ray3D ray;
    Point3D intersection_point;
    
    long double t;

    bool intersection;
    
    //for no intersection only
    RaySphereIntersection() : intersection{false} {}

    RaySphereIntersection(Sphere sphere, Ray3D ray, Point3D intersection_point, long double t) : sphere{sphere}, ray{ray}, intersection_point{intersection_point}, t{t}, intersection{true} {}

};


#endif