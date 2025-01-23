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

    //for no intersection in intersection class only
    Mesh();

    Mesh(std::string obj_file_path, Material material);

    ~Mesh();
};


#endif //MESH_H