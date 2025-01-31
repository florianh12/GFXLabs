//my code
#include "point3d.h"
#include "color.h"
#include "camera.h"
#include "parallellight.h"
#include "pointlight.h"
#include "vec3.h"
#include "sphere.h"
#include "material.h"
#include "scene.h"
#include "mesh.h"

//used libraries
#include <vector>
#include <stdexcept>
#include "tinyxml2.h"
#include <string>
#include <filesystem>
#include <memory>

//debug
#include <iostream>

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

std::vector<std::unique_ptr<Light>> extractLights(XMLElement* xml_scene) {
    std::vector<std::unique_ptr<Light>> lights = std::vector<std::unique_ptr<Light>>();
    XMLElement* xml_lights = xml_scene->FirstChildElement("lights");
    
    //iterate over and extract parallel lights
    for (XMLElement* parallel_light = xml_lights->FirstChildElement("parallel_light"); parallel_light != nullptr; 
    parallel_light = parallel_light->NextSiblingElement("parallel_light")) {

        XMLElement* xml_col = parallel_light->FirstChildElement("color");
        XMLElement* xml_dir = parallel_light->FirstChildElement("direction");

        Color color = Color(std::stod(xml_col->Attribute("r")),std::stod(xml_col->Attribute("g")),
        std::stod(xml_col->Attribute("b")));
        Vec3 direction = Vec3(std::stold(xml_dir->Attribute("x")),std::stold(xml_dir->Attribute("y")),
        std::stold(xml_dir->Attribute("z")));
        
        lights.push_back(std::make_unique<ParallelLight>(ParallelLight(color, direction)));
    }

    //iterate over and extract point lights
    for (XMLElement* point_light = xml_lights->FirstChildElement("point_light"); point_light != nullptr; 
    point_light = point_light->NextSiblingElement("point_light")) {

        XMLElement* xml_col = point_light->FirstChildElement("color");
        XMLElement* xml_pos = point_light->FirstChildElement("position");

        Color color = Color(std::stod(xml_col->Attribute("r")),std::stod(xml_col->Attribute("g")),
        std::stod(xml_col->Attribute("b")));
        Point3D position = Point3D(std::stold(xml_pos->Attribute("x")),std::stold(xml_pos->Attribute("y")),
        std::stold(xml_pos->Attribute("z")));
        
        lights.push_back(std::make_unique<PointLight>(PointLight(color, position)));
    }

    return lights;
}

std::vector<std::shared_ptr<Sphere>> extractSpheres(XMLElement* xml_scene) {
    std::vector<std::shared_ptr<Sphere>> spheres = std::vector<std::shared_ptr<Sphere>>();
    XMLElement* xml_surfaces = xml_scene->FirstChildElement("surfaces");
    
    for (XMLElement* sphere = xml_surfaces->FirstChildElement("sphere"); sphere != nullptr; 
    sphere = sphere->NextSiblingElement("sphere")) {

        XMLElement* material = sphere->FirstChildElement("material_solid");
        XMLElement* phong = material->FirstChildElement("phong");
        
        spheres.push_back(std::make_shared<Sphere>(Sphere(Material(extractColor(material,"color"),
        std::stold(phong->Attribute("ka")),
        std::stold(phong->Attribute("kd")),
        std::stold(phong->Attribute("ks")),
        std::stold(phong->Attribute("exponent"))),
        extractPosition(sphere, "position"), 
        std::stold(sphere->Attribute("radius")))));
    }

    return spheres;
}

std::vector<std::shared_ptr<Mesh>> extractMeshes(XMLElement* xml_scene, std::string dir) {
    std::vector<std::shared_ptr<Mesh>> meshes = std::vector<std::shared_ptr<Mesh>>();
    XMLElement* xml_surfaces = xml_scene->FirstChildElement("surfaces");
    
    for (XMLElement* mesh = xml_surfaces->FirstChildElement("mesh"); mesh != nullptr; mesh = mesh->NextSiblingElement("sphere")) {
        XMLElement* material = mesh->FirstChildElement("material_solid");
        XMLElement* phong = material->FirstChildElement("phong");
        
        meshes.push_back(std::make_shared<Mesh>(Mesh(dir+"/"+mesh->Attribute("name"), Material(extractColor(material,"color"),
        std::stold(phong->Attribute("ka")),
        std::stold(phong->Attribute("kd")),
        std::stold(phong->Attribute("ks")),
        std::stold(phong->Attribute("exponent"))))));
    }

    return meshes;
}

Scene extractScene(XMLElement* xml_scene, std::string dir) {
    

    return Scene(extractCamera(xml_scene),
    extractColor(xml_scene, "background_color"),
    extractColor(xml_scene->FirstChildElement("lights")->FirstChildElement("ambient_light"),"color"),
    extractLights(xml_scene), extractSpheres(xml_scene), extractMeshes(xml_scene,dir),
    xml_scene->Attribute("output_file"));
}

int main(int argc, char *argv[]) {
   XMLDocument doc;
   const XMLError err = doc.LoadFile(argv[1]);

    if(err != XML_SUCCESS) {
        throw std::runtime_error("File not loaded!");
    }

    std::filesystem::path filepath(argv[1]);

    std::string dir = filepath.parent_path();

    if(dir == "") {
        dir = ".";
    }

    XMLElement* xml_scene = doc.FirstChildElement("scene");

    Scene scene = extractScene(xml_scene, dir);

    scene.render();
}
