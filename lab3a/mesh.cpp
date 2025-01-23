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


Mesh::Mesh() : vertices{std::vector<Point3D>()}, normals{std::vector<Vec3>()}, texture_coordinates{std::vector<Point2D>()}, indices{std::vector<int>()} {}

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

                while ( std::getline(splitter, entry, delimiter)) {

                    std::stringstream entry_splitter;
                    std::string index;

                    //feed entry into stringstream for splitting
                    entry_splitter << entry;

                    while (std::getline(entry_splitter, index, '/')) {
                        
                        //convert to integer and push_back into indices
                        indices.push_back(std::stoi(index));
                    }

                }

            }
            

        }

    } else {
        throw new std::runtime_error("Couldn't open file: "+obj_file_path);
    }
}

Mesh::~Mesh() {}