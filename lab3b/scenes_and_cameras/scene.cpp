//my code
#include "scene.h"
#include "camera.h"
#include "color.h"
#include "parallellight.h"
#include "surface.h"
#include "sphere.h"
#include "mesh.h"
#include "ray3d.h"
#include "light.h"



//used libraries
#include <cmath>
#include <algorithm>
#include <memory>
#include <limits>
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

//debug
#include <iostream>

constexpr long double SHADOW_ACNE_BIAS = 1e-5;


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

            Color ray_col = trace(ray, 0);


            //prepare picture array
            size_t index = (((camera.resolution[1] - v - 1) * camera.resolution[0]) + u) * 3;
            picture[index] = static_cast<char>(std::floor(ray_col.r_normalized*255.0L));
            picture[index + 1] = static_cast<char>(std::floor(ray_col.g_normalized*255.0L));
            picture[index + 2] = static_cast<char>(std::floor(ray_col.b_normalized*255.0L));

        }

    }
    stbi_write_png(file_name,camera.resolution[0], camera.resolution[1], 3, picture, camera.resolution[0] * 3);
}



Color Scene::illuminate(RaySurfaceIntersection& intersection, Light& light) {

    
    intersection.normal.normalize();

    long double diffuse = intersection.surface->material.kd *
    std::max(((light.getDirection(intersection.intersection_point)*(-1)) * intersection.normal),0.0L);

    // if(intersection.intersection_point[0] > 3 && intersection.intersection_point[1] > 7 && intersection.intersection_point[2] <= -10) {
    //     std::cout << "Diffuse: " << diffuse << intersection.intersection_point;
    // }
    Vec3 reflection = 2 * (intersection.normal * (light.getDirection(intersection.intersection_point)*(-1)))
     * intersection.normal - (light.getDirection(intersection.intersection_point)*(-1));

    reflection.normalize();
    
    Vec3 eye = (-1) * intersection.ray.direction;

    
    long double specular = intersection.surface->material.ks * 
    std::pow(std::max((reflection * eye),0.0L),intersection.surface->material.exponent);

    return ((diffuse * intersection.surface->material.color * light.color) + (specular * light.color));

}

Ray3D Scene::reflect(Ray3D ray, RaySurfaceIntersection intersection) {
    Vec3 dir = 2 * (((-1)*ray.direction)*intersection.normal) * intersection.normal + ray.direction;
    return Ray3D(intersection.intersection_point,dir,SHADOW_ACNE_BIAS, ray.max_dist);
}


Ray3D Scene::refract(Ray3D ray, RaySurfaceIntersection intersection) {
    long double n1, nt;
    //if smaller than 0, then ray hits from outside else inside, 
    //1.0L refraction index for air
    if(ray.direction * intersection.normal < 0.0L) {
        n1 = 1.0L;
        nt = intersection.surface->material.refraction;
    } else {
        n1 = intersection.surface->material.refraction;
        nt = 1.0L;
    }

    

    long double vn = ray.direction * intersection.normal;
    long double n1_nt = n1/nt;
    //calculate frist part of t
    Vec3 t = (n1_nt) * (ray.direction + intersection.normal * (vn));

    //calculate value under root
    long double disc = 1.0L - ((n1_nt * n1_nt) * (1.0L - (vn * vn)));

    //Total internal refraction
    if(disc < 0) {
        return reflect(ray,intersection);
    }

    //calculate second part of t (see tutorial slides)
    t -= (intersection.normal * std::sqrt(disc));

    t.normalize();

    //shadow acne bias prevents surface acne
    return Ray3D(intersection.intersection_point, t,SHADOW_ACNE_BIAS,ray.max_dist);
}

Color Scene::trace(Ray3D ray, int depth) {

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


            
            if(intersection.intersection) {
               Color ray_col =  intersection.surface->material.ka * (ambient * intersection.surface->material.color);
                
                //lighting logic
                for(std::unique_ptr<Light>& light : lights) {
                    //1e-5 is the epsilon value to prevent shadow acne
                    Ray3D shadow_ray = Ray3D(intersection.intersection_point,
                    light->getDirection(intersection.intersection_point)*(-1.0),
                    SHADOW_ACNE_BIAS,light->maxT(intersection.intersection_point));//ray t limits

                    RaySurfaceIntersection tmp = RaySurfaceIntersection();
                    for (std::shared_ptr<Surface>& surface: surfaces) {

                            tmp = surface->intersect(shadow_ray);
                            
                            if(tmp.intersection)
                                break;
                    }

                    //color only if no intersections before hitting light source from intersection point
                    if (!tmp.intersection) {
                        ray_col += illuminate(intersection,*light);
                    }
                }
                //if tracing depth is reached return intersection color
                if (depth > camera.max_bounces)
                    return ray_col;

                ray_col *= (1 - (intersection.surface->material.reflectance + intersection.surface->material.transmittance));

                //do reflectance if surface reflects
                if(intersection.surface->material.reflectance > 0.0L) {
                    //generate reflected ray and trace it to get reflected color, 
                    Color reflected_color = trace(reflect(ray,intersection), depth + 1);
                    //then add it to the original color proportional to the reflectance factor 
                    ray_col += intersection.surface->material.reflectance * reflected_color;
                }
                //do refractance if surface transmitts
                if(intersection.surface->material.transmittance > 0.0L) {
                    //generate refracted ray and trace it to get refracted color
                    Color refracted_color = trace(refract(ray,intersection), depth +1);
                    //then add it to the original color proportional to the transmittance factor
                    ray_col += intersection.surface->material.transmittance * refracted_color;
                }
                
                return ray_col;

            } else {
                return background;
            }

            //needs reflectance and transmittance components
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