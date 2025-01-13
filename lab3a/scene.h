#ifndef SCENE_H
#define SCENE_H

#include "camera.h"
#include "color.h"
#include "light.h"
#include "surface.h"
#include "sphere.h"
#include "parallellight.h"
#include "raysphereintersection.h"
#include "ray3d.h"
#include <vector>

class Scene {
    Camera camera;
    Color background;
    Color ambient;
    std::vector<ParallelLight> parallel_lights;


    std::vector<Sphere> spheres;

    char* picture;
    const char* file_name;

    bool rendered;
public:
    Scene(Camera camera, Color background, Color ambient, std::vector<ParallelLight> parallel_lights, std::vector<Sphere> spheres, const char* file_name);

    void render();
    Color illuminate(RaySphereIntersection& intersection, ParallelLight& light);
    RaySphereIntersection intersect(Ray3D& ray, Sphere& sphere, unsigned int u,unsigned int v);

    unsigned int* getResolution();
    char* getPicture();


    ~Scene();
};

#endif //SCENE_H