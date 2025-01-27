#ifndef SPHERE_H
#define SPHERE_H

#include "surface.h"
#include "material.h"
#include "point3d.h"
#include "ray3d.h"

//lib dependencies
#include <memory>

struct Sphere : Surface, public std::enable_shared_from_this<Sphere> {
    long double radius;

    //for no intersection in intersection class only
    Sphere();

    Sphere(Material material, Point3D position, long double radius);

    RaySurfaceIntersection intersect(Ray3D& ray);

    Vec3 getNormal(Point3D& point, int mesh_index=0);

    std::string toString() const;

    ~Sphere();
};

std::ostream& operator<<(std::ostream& o, const Sphere& mesh);


#endif //SPHERE_H