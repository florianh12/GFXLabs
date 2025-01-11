#include "scene.h"
#include "camera.h"
#include <stdexcept>
#include <iostream>

Scene::Scene(Camera camera, Color background, Color ambient, std::vector<ParallelLight> parallel_lights, std::vector<Sphere> spheres) 
    : camera{camera}, background{background}, ambient{ambient}, parallel_lights{parallel_lights},
    spheres{spheres}, rendered{false}, picture{new unsigned int[camera.resolution[0] * camera.resolution[1] * 3]} {} //3 because we always have alpha 1 and can therefore ignore it

void Scene::render() {
    //WIP
    //TODO: Render scene
    std::cout << "paralell Lights size:" << parallel_lights.size() << std::endl;
    std::cout << "Spheres size:" << spheres.size() << std::endl;

    for (unsigned int u = 0; u < camera.resolution[0]; u++) {
        for (unsigned int v = 0; v < camera.resolution[0]; v++) {
            long double x_n = (u + 0.5) / camera.resolution[0];
            long double y_n = (v + 0.5) / camera.resolution[1];
        }

    }
}

unsigned int* Scene::getResolution() {
    return camera.resolution;
}
unsigned int* Scene::getPicture() {
    if (rendered) {
        return picture;
    }
    throw std::runtime_error("Picture isn't rendered yet!");
}


Scene::~Scene() {
    delete picture;
}