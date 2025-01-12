#include "scene.h"
#include "camera.h"
#include "ray3d.h"
#include <stdexcept>
#include <iostream>
#include <cmath>
#include <limits>

Scene::Scene(Camera camera, Color background, Color ambient, std::vector<ParallelLight> parallel_lights, std::vector<Sphere> spheres) 
    : camera{camera}, background{background}, ambient{ambient}, parallel_lights{parallel_lights},
    spheres{spheres}, rendered{false}, picture{new unsigned int[camera.resolution[0] * camera.resolution[1] * 3]} {} //3 because we always have alpha 1 and can therefore ignore it

void Scene::render() {
    //WIP
    //TODO: Render scene
    std::cout << "paralell Lights size:" << parallel_lights.size() << std::endl;
    std::cout << "Spheres size:" << spheres.size() << std::endl;
    long double viewport[2] = {2.0 * camera.resolution[0]/camera.resolution[1], 2.0,};
    //Vec3 viewport_u = Vec3(viewport[0], 0, 0);
    //Vec3 viewport_v = Vec3(0, -viewport[1],0);
    //Vec3 delta_u = viewport_u / camera.resolution[0];
    //Vec3 delta_v = viewport_v / camera.resolution[1];
    //Point3D viewport_upper_left = Point3D() - Vec3(0,0,1.0) - viewport_u/2 - viewport_v/2;
    //Point3D pixel_00 = viewport_upper_left + 0.5 * (delta_u + delta_v);
    for (unsigned int u = 0; u < camera.resolution[0]; u++) {
        for (unsigned int v = 0; v < camera.resolution[1]; v++) {
            long double x_n = (u + 0.5) / camera.resolution[0];
            long double y_n = (v + 0.5) / camera.resolution[1];
            long double x_i = (2 * x_n - 1) * std::tan(camera.fov_x);
            long double y_i = (2 * y_n -1) * std::tan(camera.fov_y);

            Ray3D ray = Ray3D(camera.position,Vec3(x_i,y_i,-1),0,1000);

            RaySphereIntersection* intersection = nullptr;
            long double min_t = std::numeric_limits<long double>::max();

            for (Sphere& sphere: spheres) {
                try
                {
                    RaySphereIntersection* tmp = ray.intersect(sphere);
                    if (tmp->t < min_t) {
                        min_t = tmp->t;
                        if(intersection != nullptr)
                            delete intersection;
                        intersection = tmp;
                    }
                }
                catch(const std::exception& e)
                {
                    continue;
                }
            }

            Color ray_col = background;

            if(intersection != nullptr) {
                ray_col = ambient;
            }

            //Deal with parallel lights
            for(const Light& light : parallel_lights) {
                //WIP
            }


            //prepare picture array
            size_t index = ((v * camera.resolution[0]) + u) * 3;
            picture[index] = ray_col.r;
            picture[index + 1] = ray_col.g;
            picture[index + 2] = ray_col.b;

            //cleanup
            delete intersection;
            intersection = nullptr;
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