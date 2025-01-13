#include "scene.h"
#include "camera.h"
#include "ray3d.h"
#include "raysphereintersection.h"
#include <stdexcept>
#include <iostream>
#include <cmath>
#include <limits>
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"
#include <algorithm>

Scene::Scene(Camera camera, Color background, Color ambient, std::vector<ParallelLight> parallel_lights, std::vector<Sphere> spheres, const char* file_name) 
    : camera{camera}, background{background}, ambient{ambient}, parallel_lights{parallel_lights},
    spheres{spheres}, rendered{false}, picture{new char[camera.resolution[0] * camera.resolution[1] * 3]}, file_name{file_name} {} //3 because we always have alpha 1 and can therefore ignore it

void Scene::render() {
    for (ParallelLight& light : parallel_lights) {
        std::cout << "light: "<< light.direction;
    }

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
                RaySphereIntersection tmp = intersect(ray, sphere,u,v);
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
                
                if (u == 88 && v == 45)
                {
                    std::cout << intersection.t << " " << intersection.intersection_point << " Sphere: " << intersection.sphere.radius << " " << intersection.sphere.position;
                    std::cout << (intersection.intersection_point - intersection.sphere.position).vec_norm() << " " << intersection.intersection << std::endl;
                }
                

                //Deal with parallel lights
                for(ParallelLight& light : parallel_lights) {
                    Ray3D shadow_ray = Ray3D(intersection.intersection_point,light.direction*(-1.0),1e-5,1000);
                    RaySphereIntersection tmp = RaySphereIntersection();
                    for (Sphere& sphere: spheres) {
                            tmp = intersect(shadow_ray, sphere,u,v);
                            
                            if(tmp.intersection)
                                break;
                    }

                    if (!tmp.intersection) {
                        ray_col += illuminate(intersection,light,u,v);
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


RaySphereIntersection Scene::intersect(Ray3D& ray, Sphere& sphere, unsigned int u,unsigned int v) {
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

    if (u == 88 && v == 45) {
        std::cout << "real t-value: " << t << " " << t-disc << " " << ray.origin << " " << ray.direction << std::endl;
    }

    return RaySphereIntersection(sphere,ray,ray.calculatePoint(t), t);

}


Color Scene::illuminate(RaySphereIntersection& intersection, ParallelLight& light, unsigned int u,unsigned int v) {

    Vec3 normal = intersection.intersection_point - intersection.sphere.position;
    
    normal.normalize();

    long double diffuse = intersection.sphere.material.kd * std::max(((light.direction*(-1)) * normal),0.0L);

    Vec3 reflection = 2 * (normal * (light.direction*(-1))) * normal - (light.direction*(-1));

    reflection.normalize();
    
    Vec3 eye =  camera.position - intersection.intersection_point;

    eye.normalize();
    
    long double specular = intersection.sphere.material.ks * std::pow(std::max((reflection * eye),0.0L),intersection.sphere.material.exponent);

    if(u == 88 && v == 45)
        std::cout << specular << " " << light.direction << " " << intersection.sphere.position << " " << intersection.intersection_point;

    return ((diffuse * intersection.sphere.material.color) + (specular * light.color));//  

}



unsigned int* Scene::getResolution() {
    return camera.resolution;
}
char* Scene::getPicture() {
    if (rendered) {
        return picture;
    }
    throw std::runtime_error("Picture isn't rendered yet!");
}


Scene::~Scene() {
    delete picture;
}