#include "camera.h"
#include <stdexcept>

Camera::Camera(Point3D position, Point3D lookat, unsigned int fov, unsigned int width, unsigned int height, unsigned int max_bounces) : position{position}, lookat{lookat}, fov_x{fov}, max_bounces{max_bounces} {
    if(position == lookat) {
        throw std::runtime_error("Position and LookAt are the same, no view directin possible!");
    }
    this->resolution[0] = width;
    this->resolution[1] = height;

    this->fov_y = fov * (height/width);
}

Camera::~Camera() {}