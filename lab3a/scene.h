#ifndef SCENE_H
#define SCENE_H

#include "camera.h"
#include "color.h"
#include "light.h"
#include "surface.h"

class Scene {
    Camera camera;
    Color ambient;
    Light* lights;
    unsigned int light_count;


    Surface* surfaces;
    unsigned int surface_count;

    unsigned int* picture;

    bool rendered;
public:
    Scene(Camera camera, Color ambient, Light* lights,
    unsigned int light_count, Surface* surfaces, unsigned int surface_count);

    void render();

    unsigned int* getResolution();
    unsigned int* getPicture();


    ~Scene();
};

#endif //SCENE_H