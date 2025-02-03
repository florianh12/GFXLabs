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

Sphere::Sphere(Material material, Point3D position, long double radius) : Surface{material, position}, radius{radius} {
    if (radius <= 0.0L) {
        throw std::runtime_error("Sphere radius is smaller orequal to 0!");
    }

}

RaySurfaceIntersection Sphere::intersect(Ray3D& ray) {
    Vec3 o = ray.origin - position;
    long double b = ray.direction*(ray.origin - position);
    long double c = (ray.direction * ray.direction) * ((o*o)-(radius*radius));
    long double disc = (b * b) - c;
    
    if (disc < 0.0L) {
        return RaySurfaceIntersection();
    }

    long double t = -(ray.direction*(ray.origin-position));
    
    if (disc != 0.0L) {

            t -= std::sqrt(disc);
    } 
    if (t <= ray.min_dist || t >= ray.max_dist) {
        return RaySurfaceIntersection();
    }
    
    Point3D point = ray.calculatePoint(t);
    Vec3 normal = getNormal(point);

    Color color = material.color;

    if(material.uses_texture) {
        //change color to color from uv
        long double u = 0.5L + (std::atan2(normal[0], normal[2]) / (2 * M_PI));
        long double v = 0.5L - (std::asin(normal[1]) / (M_PI));
        long double u_scaled = u * material.width;
        long double v_scaled = v * material.height;

        color = material.getColor(static_cast<int>(u_scaled), static_cast<int>(v_scaled));
    }
    
    return RaySurfaceIntersection(shared_from_this(),ray, point, 
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