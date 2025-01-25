#ifndef SCENE_H
#define SCENE_H

//my code
#include "camera.h"
#include "color.h"
#include "light.h"
#include "parallellight.h"
#include "surface.h"
#include "sphere.h"
#include "raysphereintersection.h"
#include "ray3d.h"
#include "mesh.h"

//used libraries
#include <vector>

class Scene {
    Camera camera;
    Color background;
    Color ambient;
    std::vector<ParallelLight> parallel_lights;


    std::vector<Sphere> spheres;
    std::vector<Mesh> meshes;

    char* picture;
    const char* file_name;

public:
    Scene(Camera camera, Color background, Color ambient, std::vector<ParallelLight> parallel_lights, std::vector<Sphere> spheres, std::vector<Mesh> meshes, const char* file_name);

    void render();
    Color illuminate(RaySphereIntersection& intersection, ParallelLight& light);
    RaySphereIntersection intersect(Ray3D& ray, Sphere& sphere);

    unsigned int* getResolution();
    char* getPicture();


    ~Scene();
};

#endif //SCENE_H