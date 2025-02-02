#ifndef RAY3D_H
#define RAY3D_H

#include "point3d.h"
#include "vec3.h"

struct Ray3D {
    Point3D origin;
    Vec3 direction;
    long double min_dist;
    long double max_dist;
   
    //for no intersection in intersection class only
    Ray3D();

    Ray3D(Point3D origin, Vec3 direction, long double min_dist, long double max_dist);

    //calculates a point on the ray
    Point3D calculatePoint(const long double t) const;


};

#endif //RAY3D_H