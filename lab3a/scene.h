#ifndef SCENE_H
#define SCENE_H

#include "camera.h"
#include "color.h"
#include "light.h"
#include "surface.h"
#include "sphere.h"
#include "parallellight.h"
#include <vector>

class Scene {
    Camera camera;
    Color background;
    Color ambient;
    std::vector<ParallelLight> parallel_lights;


    std::vector<Sphere> spheres;

    unsigned int* picture;

    bool rendered;
public:
    Scene(Camera camera, Color background, Color ambient, std::vector<ParallelLight> parallel_lights, std::vector<Sphere> spheres);

    void render();
    Color illuminate(RaySphereIntersection& intersection, ParallelLight& light);

    unsigned int* getResolution();
    unsigned int* getPicture();


    ~Scene();
};

#endif //SCENE_H