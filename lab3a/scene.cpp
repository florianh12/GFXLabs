//my code
#include "scene.h"
#include "camera.h"
#include "color.h"
#include "parallellight.h"
#include "sphere.h"
#include "ray3d.h"
#include "raysphereintersection.h"



//used libraries
#include <cmath>
#include <algorithm>
#include <memory>
#include <limits>
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"


Scene::Scene(Camera camera, Color background, Color ambient, std::vector<std::unique_ptr<Light>>&& lights, std::vector<Sphere> spheres, 
std::vector<Mesh> meshes, const char* file_name)
    : camera{camera}, background{background}, ambient{ambient}, lights{std::move(lights)},
    spheres{spheres}, meshes{meshes}, picture{new char[camera.resolution[0] * camera.resolution[1] * 3]}, file_name{file_name} {} //3 because we always have alpha 1 and can therefore ignore it

void Scene::render() {

    for (unsigned int u = 0; u < camera.resolution[0]; u++) {
        for (unsigned int v = 0; v < camera.resolution[1]; v++) {
            long double x_n = (u + 0.5) / camera.resolution[0];
            long double y_n = (v + 0.5) / camera.resolution[1];
            long double x_i = (2 * x_n - 1) * std::tan(camera.fov_x);
            long double y_i = (2 * y_n -1) * std::tan(camera.fov_y);

            Ray3D ray = Ray3D(camera.position,Vec3(x_i,y_i,-1),0,1000);

            RaySphereIntersection intersection = RaySphereIntersection();
            long double min_t = std::numeric_limits<long double>::max();

            for (Sphere& sphere: spheres) {
                RaySphereIntersection tmp = intersect(ray, sphere);
                if(tmp.intersection) {
                    if (tmp.t < min_t) {
                        min_t = tmp.t;
                        intersection = tmp;
                        
                    }
                }
            }

            Color ray_col = background;

            if(intersection.intersection) {
                ray_col =  intersection.sphere.material.ka * ambient * intersection.sphere.material.color;
                

                //Deal with lights TODO: create stopping mechanism for point lights, when the ray reaches the point, change to unique ptrs for abstraction
                for(std::unique_ptr<Light>& light : lights) {
                    //1e-5 is the epsilon value to prevent shadow acne
                    Ray3D shadow_ray = Ray3D(intersection.intersection_point,
                    light->getDirection(intersection.intersection_point)*(-1.0),1e-5,1000);

                    RaySphereIntersection tmp = RaySphereIntersection();
                    for (Sphere& sphere: spheres) {
                            tmp = intersect(shadow_ray, sphere);
                            
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


RaySphereIntersection Scene::intersect(Ray3D& ray, Sphere& sphere) {
    Vec3 o = ray.origin - sphere.position;
    long double b = ray.direction*(ray.origin - sphere.position);
    long double c = (ray.direction * ray.direction) * ((o*o)-(sphere.radius*sphere.radius));
    long double disc = (b * b) - c;
    
    if (disc < 0.0L) {
        return RaySphereIntersection();
    }

    long double t = -(ray.direction*(ray.origin-sphere.position));
    
    if (disc != 0.0L) {

            t -= std::sqrt(disc);
    } 
    if (t <= ray.min_dist)
        return RaySphereIntersection();

    return RaySphereIntersection(sphere,ray,ray.calculatePoint(t), t);

}


Color Scene::illuminate(RaySphereIntersection& intersection, Light& light) {

    Vec3 normal = intersection.intersection_point - intersection.sphere.position;
    
    normal.normalize();

    long double diffuse = intersection.sphere.material.kd * 
    std::max(((light.getDirection(intersection.intersection_point)*(-1)) * normal),0.0L);

    Vec3 reflection = 2 * (normal * (light.getDirection(intersection.intersection_point)*(-1)))
     * normal - (light.getDirection(intersection.intersection_point)*(-1));

    reflection.normalize();
    
    Vec3 eye =  camera.position - intersection.intersection_point;

    eye.normalize();
    
    long double specular = intersection.sphere.material.ks * 
    std::pow(std::max((reflection * eye),0.0L),intersection.sphere.material.exponent);

    return ((diffuse * intersection.sphere.material.color) + (specular * light.color));//  

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