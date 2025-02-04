#ifndef SURFACE_H
#define SURFACE_H

#include "point3d.h"
#include "vec3.h"
#include "material.h"
#include "ray3d.h"
#include "color.h"
#include "mat3.h"

//lib dependencies
#include <memory>

struct RaySurfaceIntersection;

//inheritance: Surface, public std::enable_shared_from_this<Subclass>, shared_from_this needs existing shared_ptr to work
struct Surface {
    Material material;
    Point3D position;

    Vec3 scale = Vec3(1.0L,1.0L,1.0L);

    Mat3 rotation = Mat3();

    Vec3 translation = Vec3();



    //for no intersection in intersection class only
    Surface() {}

    Surface(Material material, Point3D position): material{material}, position{position} {}

    Surface(Material material, Point3D position, Vec3 scale=Vec3(1.0L,1.0L,1.0L), 
    Mat3 rotation=Mat3(), Vec3 translation=Vec3()): material{material}, position{position}, 
    scale{scale}, rotation{rotation}, translation{translation} {}

    Ray3D transform(Ray3D ray)  {
        Ray3D transformed_ray = Ray3D(ray);
        //inverse scaling
        transformed_ray.direction[0] /= scale[0];
        transformed_ray.direction[1] /= scale[1];
        transformed_ray.direction[2] /= scale[2];
        //inverse rotation
        Mat3 rot_inv = rotation.T();
        transformed_ray.direction = rot_inv * transformed_ray.direction;
        //inverse translation
        transformed_ray.origin -= translation;
        return transformed_ray;
    }

    Vec3 transformNormal(Vec3 normal) {
        //inverse scaling
            normal[0] /= scale[0];
            normal[1] /= scale[1];
            normal[2] /= scale[2];
            //inverse rotation
            normal = rotation.T() * normal;
            
            normal.normalize();

        return normal;
    }

    virtual RaySurfaceIntersection intersect(Ray3D& ray) = 0;
    virtual Vec3 getNormal(Point3D& point, int mesh_index=0) = 0;

    virtual std::string toString() const;
    
    ~Surface() {}

};


//intersection class
struct RaySurfaceIntersection {
    std::shared_ptr<Surface> surface;
    Ray3D ray;
    Point3D intersection_point;
    Vec3 normal;
    Color surface_color;
    int mesh_index;
    
    long double t;

    bool intersection;
    
    //for no intersection only
    RaySurfaceIntersection() : intersection{false} {}

    RaySurfaceIntersection(std::shared_ptr<Surface> surface, Ray3D ray, Point3D intersection_point, Vec3 normal, Color surface_color, long double t, int mesh_index=0) 
    : surface{surface}, ray{ray}, intersection_point{intersection_point}, 
    normal{normal}, surface_color{surface_color}, t{t}, mesh_index{mesh_index}, intersection{true} {}

};





inline Vec3 Surface::getNormal(Point3D& point,int mesh_index)  { return Vec3(); }

inline RaySurfaceIntersection Surface::intersect(Ray3D& ray) { return RaySurfaceIntersection(); }

inline std::string Surface::toString() const { return "";}

inline std::ostream& operator<<(std::ostream& o, const Surface& surface) {
    o << surface.toString();

    return o;
}

#endif //SURFACE_H