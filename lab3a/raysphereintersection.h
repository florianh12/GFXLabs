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
    
    RaySphereIntersection() : sphere{Sphere(Material(Color(0,0,0),0,0,0,0),Point3D(),0.1)}, ray{Ray3D(Point3D(),Vec3(1),0,1)}, intersection_point{Point3D()}, t{0}, intersection{false} {}

    RaySphereIntersection(Sphere sphere, Ray3D ray, Point3D intersection_point, long double t) : sphere{sphere}, ray{ray}, intersection_point{intersection_point}, t{t}, intersection{true} {}

};


#endif