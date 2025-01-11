#include "scene.h"
#include "camera.h"
#include <stdexcept>

Scene::Scene(Camera camera, Color ambient, std::vector<Light> lights, std::vector<Surface> surfaces) 
    : camera{camera}, ambient{ambient}, lights{lights},
    surfaces{surfaces}, rendered{false}, picture{new unsigned int[camera.resolution[0] * camera.resolution[1] * 3]} {} //3 because we always have alpha 1 and can therefore ignore it

void Scene::render() {
    //WIP
    //TODO: Render scene
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