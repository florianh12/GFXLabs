#include <iostream>
#include "vec3.h"

int main(int argc, char *argv[]) {
    // std::cout << argv[1] << "\n";
    /*std::cout << argv[2] << "\n";

    */
   Vec3 test = Vec3(1.0, 0.0, 0.0);
   Vec3 test2 = Vec3(0.0, 1.0, 0.0);


   std::cout << (test % test2).toString();
}
