#ifndef CAMERA_H
#define CAMERA_H

#include "point3d.h"

struct Camera {
    Point3D position;
    Point3D lookat;
    unsigned int fov;
    unsigned int* resolution;
    unsigned int max_bounces;

    Camera(Point3D position, Point3D lookat, unsigned int fov, unsigned int resolution[2], unsigned int max_bounces);
    
    ~Camera();
};



#endif //CAMERA_H