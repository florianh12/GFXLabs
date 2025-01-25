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
    std::vector<int> vertex_indices;
    std::vector<int> normal_indices;
    std::vector<int> texture_coordinate_indices;

    Material material;

    //for no intersection in intersection class only
    Mesh();

    Mesh(std::string obj_file_path, Material material);

    std::string toString() const; 

    ~Mesh();
};

std::ostream& operator<<(std::ostream& o, const Mesh& mesh);


#endif //MESH_H