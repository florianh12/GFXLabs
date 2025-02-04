//my code
#include "surface.h"
#include "sphere.h"
#include "material.h"
#include "point3d.h"


//used libraries
#include <stdexcept>
#include <cmath>
#include <sstream>
#include <memory>

//debug
#include <iostream>

//for no intersection in intersection class only
Sphere::Sphere() {}

Sphere::Sphere(Material material, Point3D position, long double radius, Vec3 scale, 
    Mat3 rotation, Vec3 translation) : Surface{material, position,scale,rotation,translation}, radius{radius} {
    if (radius <= 0.0L) {
        throw std::runtime_error("Sphere radius is smaller orequal to 0!");
    }

}

RaySurfaceIntersection Sphere::intersect(Ray3D& ray) {
    Ray3D transformed_ray = transform(ray);
    long double a = transformed_ray.direction * transformed_ray.direction;
    Vec3 o = transformed_ray.origin - position;
    long double b = transformed_ray.direction*(o);
    long double c = (o * o) - (radius*radius);
    long double disc = (b * b) - a * c;
    
    if (disc < 0.0L) {
        return RaySurfaceIntersection();
    }

    long double closer = (-b - std::sqrt(disc)) / a; 
    long double t = 0;

    //take closer if bigger than min_dist
    if(closer < ray.min_dist) {
        t = (-b + std::sqrt(disc)) / a;
    } else {
        t = closer;
    }
    
    //check if t value fits requirements after picking value more fitting
    if (t <= transformed_ray.min_dist || t >= transformed_ray.max_dist) {
        return RaySurfaceIntersection();
    }
    
    Point3D point = transformed_ray.calculatePoint(t);
    Vec3 normal = transformNormal(point - position);

    Color color = material.color;

    if(material.uses_texture) {
        //change color to color from uv
        long double u = 0.5L + (std::atan2(normal[0], normal[2]) / (2 * M_PI));
        //normalize u to 0 - 1
        u -= std::floor(u); 
        long double v = 0.5L - (std::asin(normal[1]) / (M_PI));
        //normalize v to 0 - 1
        v -= std::floor(v);
        long double u_scaled = u * material.width;
        long double v_scaled = v * material.height;

        color = material.getColor(static_cast<int>(u_scaled), static_cast<int>(v_scaled));
    }
    
    return RaySurfaceIntersection(shared_from_this(),transformed_ray, point, 
    normal, color, t);
}

Vec3 Sphere::getNormal(Point3D& point, int mesh_index) {
    //calculate surface normal of point
    Vec3 normal = point - position;
    
    normal.normalize();

    return normal;
}

std::string Sphere::toString() const {
    std::stringstream retstring;

    retstring << "Sphere{\n\tposition: " << position;
    
    retstring << "\n\tradius: " << radius;

    retstring << "\n\tmaterial:\n" << material.toString("\t\t") << "}\n";

    return retstring.str();
}

std::ostream& operator<<(std::ostream& o, const Sphere& mesh) {
    o << mesh.toString();

    return o;
}


Sphere::~Sphere() {}