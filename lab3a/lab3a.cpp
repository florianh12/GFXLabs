#include <iostream>
#include <string>
#include "vec3.h"
#include "point3d.h"
#include "ray3d.h"
#include "color.h"
#include "camera.h"
#include "parallellight.h"

#include "tinyxml2.h"
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

using namespace tinyxml2;

Point3D extractPosition(XMLElement* parent_element, const char* pos_element_name) {
    XMLElement* pos = parent_element->FirstChildElement(pos_element_name);

    return Point3D(std::stold(pos->Attribute("x")), 
    std::stold(pos->Attribute("y")), 
    std::stold(pos->Attribute("z")));
}

Camera extractCamera(XMLElement* xml_scene) {
    XMLElement* camera = xml_scene->FirstChildElement("camera");
    XMLElement* h_fov = camera->FirstChildElement("horizontal_fov");
    XMLElement* res = camera->FirstChildElement("resolution");
    XMLElement* bounces = camera->FirstChildElement("max_bounces");

    return Camera(extractPosition(camera,"position"),
    extractPosition(camera,"lookat"), 
    static_cast<unsigned int>(std::stoul(h_fov->Attribute("angle"))), 
    static_cast<unsigned int>(std::stoul(res->Attribute("horizontal"))),
    static_cast<unsigned int>(std::stoul(res->Attribute("vertical"))),
    static_cast<unsigned int>(std::stoul(bounces->Attribute("n")))
    );
}

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

    XMLElement* xml_scene = doc.FirstChildElement("xml_scene");

    Camera camera = extractCamera(xml_scene);

    std::cout << printer.CStr();
    std::cout << camera.fov << std::endl;

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
    Point3D test_origin = Point3D(); 
    Vec3 test = Vec3(1.0, 0.0, 0.0);
    Vec3 test2 = Vec3(0.0, 1.0, 0.0);
    Vec3 test3 = Vec3(2.0, 0.0, 0.0);
    Ray3D test_ray = Ray3D(test_origin,test,0.1L,1.1L);
    std::cout << test_ray.calculatePoint(1.0L);
   
    std::cout << test3;
    test3.normalize();
    std::cout << test3;

    Color col = Color(1.0,0.8,0.3);

    std::cout << static_cast<int>(col.b) << std::endl;
}
