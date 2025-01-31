#ifndef SURFACE_H
#define SURFACE_H

#include "point3d.h"
#include "vec3.h"
#include "material.h"
#include "ray3d.h"

//lib dependencies
#include <memory>

struct RaySurfaceIntersection;

//inheritance: Surface, public std::enable_shared_from_this<Subclass>, shared_from_this needs existing shared_ptr to work
struct Surface {
    Material material;
    Point3D position;

    //for no intersection in intersection class only
    Surface() {}

    Surface(Material material, Point3D position): material{material}, position{position} {}


    virtual RaySurfaceIntersection intersect(Ray3D& ray) = 0;
    virtual Vec3 getNormal(Point3D& point, int mesh_index=0) = 0;
    
    ~Surface() {}

};


//intersection class
struct RaySurfaceIntersection {
    std::shared_ptr<Surface> surface;
    Ray3D ray;
    Point3D intersection_point;
    Vec3 normal;
    int mesh_index;
    
    long double t;

    bool intersection;
    
    //for no intersection only
    RaySurfaceIntersection() : intersection{false} {}

    RaySurfaceIntersection(std::shared_ptr<Surface> surface, Ray3D ray, Point3D intersection_point, Vec3 normal, long double t, int mesh_index=0) : surface{surface}, ray{ray}, intersection_point{intersection_point}, normal{normal}, t{t}, mesh_index{mesh_index}, intersection{true} {}

};





inline Vec3 Surface::getNormal(Point3D& point,int mesh_index)  { return Vec3(); }

inline RaySurfaceIntersection Surface::intersect(Ray3D& ray) { return RaySurfaceIntersection(); }

#endif //SURFACE_H