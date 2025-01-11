#ifndef RAY3D_H
#define RAY3D_H

#include "point3d.h"
#include "vec3.h"
#include "raysphereintersection.h"

struct Ray3D {
    Point3D origin;
    Vec3 direction;
    long double min_dist;
    long double max_dist;

    Ray3D(Point3D origin, Vec3 direction, long double min_dist, long double max_dist);

    //calculates a point on the ray
    Point3D calculatePoint(long double t);

    RaySphereIntersection intersect(Sphere& sphere);

};

#endif //RAY3D_H