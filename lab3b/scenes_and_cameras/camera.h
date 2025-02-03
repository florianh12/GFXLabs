#ifndef CAMERA_H
#define CAMERA_H

#include "point3d.h"
#include "vec3.h"

struct Camera {
    Point3D position;
    Point3D lookat;
    Vec3 up;
    long double fov_x;
    long double fov_y;
    unsigned int resolution[2];
    unsigned int max_bounces;

    Camera(Point3D position, Point3D lookat, Vec3 up, unsigned int fov, unsigned int width, unsigned int height, unsigned int max_bounces);
    
    ~Camera();
};



#endif //CAMERA_H