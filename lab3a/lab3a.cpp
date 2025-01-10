#include <iostream>
#include "vec3.h"
#include "point3d.h"
#include "tinyxml2.h"
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

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

    XMLPrinter printer;

    doc.Print(&printer);

    std::cout << printer.CStr();

    int image_width = 256, image_height = 256;

    char image[image_width * image_height * 3];

    for(size_t x = 0; x < image_width; x++) {
        for(size_t y = 0; y < image_height; y++) {
            int index = ((y * image_width) + x) * 3;
            image[index] = static_cast<char>(x);
            image[index + 1] = static_cast<char>(y);
            image[index + 2] = static_cast<char>(255);
        }
    }

    stbi_write_png("test.png",image_width, image_height, 3, image, image_width * 3);

    Vec3 test = Vec3(1.0, 0.0, 0.0);
    Vec3 test2 = Vec3(0.0, 1.0, 0.0);
    Vec3 test3 = Vec3(2.0, 0.0, 0.0);
   
    std::cout << test3;
    test3.normalize();
    std::cout << test3;


}
