#ifndef MESH_H
#define MESH_H

#include "surface.h"
#include "material.h"
#include "point3d.h"
#include "point2d.h"
#include <string>
#include <vector>

struct Mesh : Surface {
    std::vector<Point3D> vertices;
    std::vector<Vec3> normals;
    std::vector<Point2D> texture_coordinates;
    //Has the from of vertex_index, texture_coordinate_index, normal_index x3 per face/triangle
    std::vector<int> indices;

    Material material;

    //for no intersection in intersection class only
    Mesh();

    Mesh(std::string obj_file_path, Material material);

    ~Mesh();
};


#endif //MESH_H