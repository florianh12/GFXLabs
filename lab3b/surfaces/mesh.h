#ifndef MESH_H
#define MESH_H

#include "surface.h"
#include "material.h"
#include "point3d.h"
#include "point2d.h"
#include "ray3d.h"
#include <string>
#include <vector>
#include <memory>

//shared_from_this needs existing shared ptr
struct Mesh : Surface, public std::enable_shared_from_this<Mesh> {
    std::vector<Point3D> vertices;
    std::vector<Vec3> normals;
    std::vector<Point2D> texture_coordinates;
    std::vector<int> vertex_indices;
    std::vector<int> normal_indices;
    std::vector<int> texture_coordinate_indices;


    //for no intersection in intersection class only
    Mesh();

    Mesh(std::string obj_file_path, Material material,Vec3 scale=Vec3(1.0L,1.0L,1.0L), 
    Mat3 rotation=Mat3(), Vec3 translation=Vec3());

    std::string toString() const;

    RaySurfaceIntersection intersect(Ray3D& ray);

    Vec3 getNormal(Point3D& point, int mesh_index=0);

    Point2D getUV(Vec3 tab, size_t i); 

    ~Mesh();
};

std::ostream& operator<<(std::ostream& o, const Mesh& mesh);

#endif //MESH_H