//my code
#include "mesh.h"
#include "point3d.h"
#include "point2d.h"
#include "vec3.h"
#include "material.h"

//lib dependencies
#include <vector>
#include <fstream>
#include <string>
#include <sstream>
#include <stdexcept>


Mesh::Mesh() : vertices{std::vector<Point3D>()}, normals{std::vector<Vec3>()}, texture_coordinates{std::vector<Point2D>()}, 
vertex_indices{std::vector<int>()}, normal_indices{std::vector<int>()}, texture_coordinate_indices{std::vector<int>()} {}

Mesh::Mesh(std::string obj_file_path, Material material) : Mesh() {
    this->material = material;
    std::ifstream obj_file (obj_file_path);
    std::string line;

    if(obj_file.is_open()) {
        while (std::getline(obj_file,line)) {

            std::string type;
            std::stringstream splitter;
            char delimiter = ' ';

            //feed line into stringstream for splitting
            splitter << line;

            //get entry type
            std::getline(splitter, type, delimiter);
            
            
            if(type == "v") {
                //if line contains a vertex

                std::string x;
                std::string y;
                std::string z;
                //get coordinate values from stream
                std::getline(splitter, x, delimiter);
                std::getline(splitter, y, delimiter);
                std::getline(splitter, z, delimiter);

                //convert to long double and push_back into vertices
                this->vertices.push_back(Point3D(std::stold(x), std::stold(y), std::stold(z)));

            } else if(type == "vn") {
                //if line contains a vertex normal

                std::string x;
                std::string y;
                std::string z;
                //get coordinate values from stream
                std::getline(splitter, x, delimiter);
                std::getline(splitter, y, delimiter);
                std::getline(splitter, z, delimiter);

                //convert to long double and push_back into vertices
                this->normals.push_back(Vec3(std::stold(x), std::stold(y), std::stold(z)));

            } else if(type == "vt") {
                //if line contains a texture coordinate

                std::string x;
                std::string y;

                //get coordinate values from stream
                std::getline(splitter, x, delimiter);
                std::getline(splitter, y, delimiter);

                //convert to long double and push_back into normals
                this->texture_coordinates.push_back(Point2D(std::stold(x), std::stold(y)));

            } else if(type == "f") {
                //if line contains a face

                std::string entry;

                while (std::getline(splitter, entry, delimiter)) {

                    std::stringstream entry_splitter;
                    std::string vertex_index;
                    std::string normal_index;
                    std::string texture_coordinate_index;

                    //feed entry into stringstream for splitting
                    entry_splitter << entry;

                    std::getline(entry_splitter, vertex_index, '/');
                    std::getline(entry_splitter, texture_coordinate_index, '/');
                    std::getline(entry_splitter, normal_index, '/');
                    
                    //subtract 1 to start at index 0
                    vertex_indices.push_back(std::stoi(vertex_index)-1);
                    texture_coordinate_indices.push_back(std::stoi(texture_coordinate_index)-1);
                    normal_indices.push_back(std::stoi(normal_index)-1);

                }
            }   
        }

        if (vertex_indices.size() != texture_coordinate_indices.size() 
        || vertex_indices.size() != normal_indices.size())  {
            throw std::runtime_error("Indices sizes don't match, vertices: "+
            std::to_string(vertex_indices.size())+", normals: "+
            std::to_string(normal_indices.size())+", texture: "+std::to_string(texture_coordinate_indices.size()));
        }
        

    } else {
        throw std::runtime_error("Couldn't open file: "+obj_file_path);
    }
}

std::string Mesh::toString() const  {
    std::stringstream retstring;

    retstring << "Mesh{\n\tvertices: [\n";
    
    for(const Point3D& vertex : vertices) {
        retstring << "\t\t" << vertex;
    } 

    retstring << "\t]\n\n\tnormals: [\n";

    for(const Vec3& normal : normals) {
        retstring << "\t\t" << normal;
    }

    retstring << "\t]\n\n\ttexture coordinates: [\n";

    for(const Point2D& texture_coordinate : texture_coordinates) {
        retstring << "\t\t" << texture_coordinate;
    }

    retstring << "\t]\n\n\tindices(vertex/texture/normal): [\n";

    for (size_t i = 0; i < vertex_indices.size(); i++) {
        if(i%3 == 0) {
            retstring << "\t\t";
        }
        //added 1 for .obj file comparisons
        retstring << vertex_indices[i]+1 << "/" << texture_coordinate_indices[i]+1 << "/" << normal_indices[i]+1 << " ";

        if(i%3 == 2) {
            retstring << "\n";
        }
    }

    retstring << "\t]\n\tmaterial:\n" << material.toString("\t\t") << "}\n";

    return retstring.str();
}

std::ostream& operator<<(std::ostream& o, const Mesh& mesh) {
    o << mesh.toString();

    return o;
}

Mesh::~Mesh() {}