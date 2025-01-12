#include <iostream>
#include <string>
#include <vector>
#include "vec3.h"
#include "point3d.h"
#include "ray3d.h"
#include "color.h"
#include "camera.h"
#include "parallellight.h"
#include "sphere.h"
#include "scene.h"

#include "tinyxml2.h"


using namespace tinyxml2;

Point3D extractPosition(XMLElement* parent_element, const char* pos_element_name) {
    XMLElement* pos = parent_element->FirstChildElement(pos_element_name);

    return Point3D(std::stold(pos->Attribute("x")), 
    std::stold(pos->Attribute("y")), 
    std::stold(pos->Attribute("z")));
}

Color extractColor(XMLElement* parent_element, const char* pos_element_name) {
    XMLElement* pos = parent_element->FirstChildElement(pos_element_name);

    return Color(std::stold(pos->Attribute("r")), 
    std::stold(pos->Attribute("g")), 
    std::stold(pos->Attribute("b")));
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
std::vector<ParallelLight> extractParalellLights(XMLElement* xml_scene) {
    std::vector<ParallelLight> lights = std::vector<ParallelLight>();
    XMLElement* xml_lights = xml_scene->FirstChildElement("lights");
    
    //iterate over paralell lights
    for (XMLElement* parallel_light = xml_lights->FirstChildElement("parallel_light"); parallel_light != nullptr; parallel_light = parallel_light->NextSiblingElement("parallel_light")) {
        XMLElement* xml_col = parallel_light->FirstChildElement("color");
        XMLElement* xml_dir = parallel_light->FirstChildElement("direction");
        Color color = Color(std::stod(xml_col->Attribute("r")),std::stod(xml_col->Attribute("g")),std::stod(xml_col->Attribute("b")));
        Vec3 direction = Vec3(std::stold(xml_dir->Attribute("x")),std::stold(xml_dir->Attribute("y")),std::stold(xml_dir->Attribute("z")));
        lights.push_back(ParallelLight(color, direction));
    }

    return lights;
}

std::vector<Sphere> extractSpheres(XMLElement* xml_scene) {
    std::vector<Sphere> spheres = std::vector<Sphere>();
    XMLElement* xml_surfaces = xml_scene->FirstChildElement("surfaces");
    
    for (XMLElement* sphere = xml_surfaces->FirstChildElement("sphere"); sphere != nullptr; sphere = sphere->NextSiblingElement("sphere")) {
        XMLElement* material = sphere->FirstChildElement("material_solid");
        XMLElement* phong = material->FirstChildElement("phong");
        
        spheres.push_back(Sphere(Material(extractColor(material,"color"),
        std::stold(phong->Attribute("ka")),
        std::stold(phong->Attribute("kd")),
        std::stold(phong->Attribute("ks")),
        std::stold(phong->Attribute("exponent"))),
        extractPosition(sphere, "position"), 
        std::stold(sphere->Attribute("radius"))));
    }

    return spheres;
}

Scene extractScene(XMLElement* xml_scene) {
    

    return Scene(extractCamera(xml_scene),
    extractColor(xml_scene, "background_color"),
    extractColor(xml_scene->FirstChildElement("lights")->FirstChildElement("ambient_light"),"color"),
    extractParalellLights(xml_scene), extractSpheres(xml_scene),xml_scene->Attribute("output_file"));
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

    XMLElement* xml_scene = doc.FirstChildElement("scene");

    Scene scene = extractScene(xml_scene);

    std::cout << printer.CStr();
    std::cout << "Test" << std::endl;
    scene.render();

    int image_width = 256, image_height = 256;

    char image[image_width * image_height * 3];

    for(size_t x = 0; x < image_width; x++) {
        for(size_t y = 0; y < image_height; y++) {
            int index = ((y * image_width) + x) * 3;
            image[index] = 255;
            image[index + 1] = 0;
            image[index + 2] = 0;
        }
    }

    
}
