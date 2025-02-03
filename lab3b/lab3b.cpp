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

Material extractMaterial(XMLElement* parent_element, const char* pos_element_name, bool uses_texture=false, std::string dir=".") {
    XMLElement* material = parent_element->FirstChildElement(pos_element_name);

    XMLElement* phong = material->FirstChildElement("phong");
    XMLElement* reflectance = material->FirstChildElement("reflectance");
    XMLElement* transmittance = material->FirstChildElement("transmittance");
    XMLElement* refraction = material->FirstChildElement("refraction");

    Color color = Color(1,1,1);

    if (!uses_texture) {
        return Material(extractColor(material,"color"),
            std::stold(phong->Attribute("ka")),
            std::stold(phong->Attribute("kd")),
            std::stold(phong->Attribute("ks")),
            std::stold(phong->Attribute("exponent")),
            std::stold(reflectance->Attribute("r")),
            std::stold(transmittance->Attribute("t")),
            std::stold(refraction->Attribute("iof")));
    } 

    XMLElement* texture = material->FirstChildElement("texture");
    
    return Material(std::stold(phong->Attribute("ka")),
            std::stold(phong->Attribute("kd")),
            std::stold(phong->Attribute("ks")),
            std::stold(phong->Attribute("exponent")),
            std::stold(reflectance->Attribute("r")),
            std::stold(transmittance->Attribute("t")),
            std::stold(refraction->Attribute("iof")),
            dir + "/" + texture->Attribute("name"));
    
}

Camera extractCamera(XMLElement* xml_scene) {
    XMLElement* camera = xml_scene->FirstChildElement("camera");
    XMLElement* h_fov = camera->FirstChildElement("horizontal_fov");
    XMLElement* res = camera->FirstChildElement("resolution");
    XMLElement* bounces = camera->FirstChildElement("max_bounces");
    XMLElement* up = camera->FirstChildElement("up");

    return Camera(extractPosition(camera,"position"),
    extractPosition(camera,"lookat"), 
    Vec3(std::stold(up->Attribute("x")), 
    std::stold(up->Attribute("y")), std::stold(up->Attribute("z"))),
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
        
        lights.push_back(std::make_unique<PointLight>(PointLight(color, extractPosition(point_light,"position"))));
    }

    return lights;
}

std::vector<std::shared_ptr<Surface>> extractSurfaces(XMLElement* xml_scene, std::string dir) {
    std::vector<std::shared_ptr<Surface>> surfaces = std::vector<std::shared_ptr<Surface>>();
    XMLElement* xml_surfaces = xml_scene->FirstChildElement("surfaces");

    //iterate over spheres
    for (XMLElement* sphere = xml_surfaces->FirstChildElement("sphere"); sphere != nullptr; 
    sphere = sphere->NextSiblingElement("sphere")) {
        Material material;
        
        if(sphere->FirstChildElement("material_solid") == nullptr) {
            material = extractMaterial(sphere,"material_textured",true,dir);
        } else {
            material = extractMaterial(sphere, "material_solid");
        }
        
        surfaces.push_back(std::make_shared<Sphere>(Sphere(
            material,
        extractPosition(sphere, "position"), 
        std::stold(sphere->Attribute("radius")))));
    }
    
    //iterate over meshes
    for (XMLElement* mesh = xml_surfaces->FirstChildElement("mesh"); mesh != nullptr; mesh = mesh->NextSiblingElement("sphere")) {
        Material material;
        
        if(mesh->FirstChildElement("material_solid") == nullptr) {
            material = extractMaterial(mesh,"material_textured", true, dir);
        } else {
            material = extractMaterial(mesh, "material_solid");
        }
        
        surfaces.push_back(std::make_shared<Mesh>(Mesh(dir+"/"+mesh->Attribute("name"), material)));
    }
    
    return surfaces;
}

Scene extractScene(XMLElement* xml_scene, std::string dir) {
    

    return Scene(extractCamera(xml_scene),
    extractColor(xml_scene, "background_color"),
    extractColor(xml_scene->FirstChildElement("lights")->FirstChildElement("ambient_light"),"color"),
    extractLights(xml_scene), extractSurfaces(xml_scene, dir),
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
