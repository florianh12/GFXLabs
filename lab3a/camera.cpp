#include "camera.h"
#include <stdexcept>

Camera::Camera(Point3D position, Point3D lookat, unsigned int fov, unsigned int resolution[2], unsigned int max_bounces) : position{position}, lookat{lookat}, fov{fov}, resolution{resolution}, max_bounces{max_bounces} {
    if(position == lookat) {
        throw std::runtime_error("Position and LookAt are the same, no view directin possible!");
    }
}

Camera::~Camera() {
    delete resolution;
}