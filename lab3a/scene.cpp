//my code
#include "scene.h"
#include "camera.h"
#include "color.h"
#include "parallellight.h"
#include "surface.h"
#include "sphere.h"
#include "mesh.h"
#include "ray3d.h"



//used libraries
#include <cmath>
#include <algorithm>
#include <memory>
#include <limits>
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

//debug
#include <iostream>


Scene::Scene(Camera camera, Color background, Color ambient, std::vector<std::unique_ptr<Light>>&& lights, std::vector<std::shared_ptr<Surface>> surfaces, const char* file_name)
    : camera{camera}, background{background}, ambient{ambient}, lights{std::move(lights)},
    surfaces{surfaces}, picture{new char[camera.resolution[0] * camera.resolution[1] * 3]}, file_name{file_name} {} //3 because we always have alpha 1 and can therefore ignore it

void Scene::render() {

    for (unsigned int u = 0; u < camera.resolution[0]; u++) {
        for (unsigned int v = 0; v < camera.resolution[1]; v++) {
            long double x_n = (u + 0.5) / camera.resolution[0];
            long double y_n = (v + 0.5) / camera.resolution[1];
            long double x_i = (2 * x_n - 1) * std::tan(camera.fov_x);
            long double y_i = (2 * y_n -1) * std::tan(camera.fov_y);

            Ray3D ray = Ray3D(camera.position,Vec3(x_i,y_i,-1),0,std::numeric_limits<long double>::infinity());

            //Ray sphere intersection tests, TODO: test intersection for Mesh, then integrate meshes into sphere/surface intersection tests
            RaySurfaceIntersection intersection = RaySurfaceIntersection();
            long double min_t = std::numeric_limits<long double>::max();

            for (std::shared_ptr<Surface>& surface: surfaces) {
                RaySurfaceIntersection tmp = surface->intersect(ray);
                if(tmp.intersection) {
                    if (tmp.t < min_t) {
                        min_t = tmp.t;
                        intersection = tmp;
                        
                    }
                }
            }


            Color ray_col = background;
            if(intersection.intersection) {
                ray_col =  intersection.surface->material.ka * ambient * intersection.surface->material.color;
                

                for(std::unique_ptr<Light>& light : lights) {
                    //1e-5 is the epsilon value to prevent shadow acne
                    Ray3D shadow_ray = Ray3D(intersection.intersection_point,
                    light->getDirection(intersection.intersection_point)*(-1.0),
                    1e-5,light->maxT(intersection.intersection_point));//ray t limits

                    RaySurfaceIntersection tmp = RaySurfaceIntersection();
                    for (std::shared_ptr<Surface>& surface: surfaces) {

                            tmp = surface->intersect(shadow_ray);
                            
                            if(tmp.intersection)
                                break;
                    }

                    if (!tmp.intersection) {
                        ray_col += illuminate(intersection,*light);
                    }
                }
            }


            //prepare picture array
            size_t index = (((camera.resolution[1] - v - 1) * camera.resolution[0]) + u) * 3;
            picture[index] = static_cast<char>(ray_col.r_normalized*255.0L);
            picture[index + 1] = static_cast<char>(ray_col.g_normalized*255.0L);
            picture[index + 2] = static_cast<char>(ray_col.b_normalized*255.0L);

        }

    }
    stbi_write_png(file_name,camera.resolution[0], camera.resolution[1], 3, picture, camera.resolution[0] * 3);
}


Color Scene::illuminate(RaySurfaceIntersection& intersection, Light& light) {

    Vec3 normal = intersection.surface->getNormal(intersection.intersection_point, intersection.mesh_index);
    
    normal.normalize();

    long double diffuse = intersection.surface->material.kd * 
    std::max(((light.getDirection(intersection.intersection_point)*(-1)) * normal),0.0L);

    Vec3 reflection = 2 * (normal * (light.getDirection(intersection.intersection_point)*(-1)))
     * normal - (light.getDirection(intersection.intersection_point)*(-1));

    reflection.normalize();
    
    Vec3 eye =  camera.position - intersection.intersection_point;

    eye.normalize();
    
    long double specular = intersection.surface->material.ks * 
    std::pow(std::max((reflection * eye),0.0L),intersection.surface->material.exponent);

    return ((diffuse * intersection.surface->material.color) + (specular * light.color));//  

}



unsigned int* Scene::getResolution() {
    return camera.resolution;
}
char* Scene::getPicture() {
        return picture;
}


Scene::~Scene() {
    delete[] picture;
}