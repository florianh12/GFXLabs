#ifndef SCENE_H
#define SCENE_H

#include "camera.h"
#include "color.h"
#include "light.h"
#include "surface.h"
#include <vector>

class Scene {
    Camera camera;
    Color ambient;
    std::vector<Light> lights;


    std::vector<Surface> surfaces;

    unsigned int* picture;

    bool rendered;
public:
    Scene(Camera camera, Color ambient, std::vector<Light> lights, std::vector<Surface> surfaces);

    void render();

    unsigned int* getResolution();
    unsigned int* getPicture();


    ~Scene();
};

#endif //SCENE_H