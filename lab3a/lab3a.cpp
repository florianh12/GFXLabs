#include <iostream>
#include "vec3.h"
#include "point3d.h"
#include "tinyxml2.h"

using namespace tinyxml2;

int main(int argc, char *argv[]) {
    // std::cout << argv[1] << "\n";
    /*std::cout << argv[2] << "\n";

    */
   XMLDocument doc;
   const XMLError err = doc.LoadFile(argv[1]);

    if(err != XML_SUCCESS) {
        throw std::runtime_error("File not loaded!");
    }

   Vec3 test = Vec3(1.0, 0.0, 0.0);
   Vec3 test2 = Vec3(0.0, 1.0, 0.0);
   Vec3 test3 = Vec3(2.0, 0.0, 0.0);
   
    std::cout << test3;
    test3.normalize();
    std::cout << test3;


}
