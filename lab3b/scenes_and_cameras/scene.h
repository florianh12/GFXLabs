#ifndef SCENE_H
#define SCENE_H

//my code
#include "camera.h"
#include "color.h"
#include "light.h"
#include "parallellight.h"
#include "surface.h"
#include "sphere.h"
#include "ray3d.h"
#include "mesh.h"

//used libraries
#include <vector>
#include <memory>

class Scene {
    Camera camera;
    Color background;
    Color ambient;
    std::vector<std::unique_ptr<Light>> lights;


    std::vector<std::shared_ptr<Surface>> surfaces;

    char* picture;
    const char* file_name;

public:
    Scene(Camera camera, Color background, Color ambient, std::vector<std::unique_ptr<Light>>&& lights, 
    std::vector<std::shared_ptr<Surface>> surfaces, const char* file_name);

    void render();
    Color illuminate(RaySurfaceIntersection& intersection, Light& light);
    Color trace(Ray3D ray, int depth);
    Ray3D reflect(Ray3D ray, RaySurfaceIntersection intersection);
    Ray3D refract(RaySurfaceIntersection intersection);

    unsigned int* getResolution();
    char* getPicture();


    ~Scene();
};

#endif //SCENE_H