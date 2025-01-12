#include "camera.h"
#include <stdexcept>
#include <cmath>

Camera::Camera(Point3D position, Point3D lookat, unsigned int fov, unsigned int width, unsigned int height, unsigned int max_bounces) : position{position}, lookat{lookat}, fov_x{fov * M_PI / 180}, max_bounces{max_bounces} {
    if(position == lookat) {
        throw std::runtime_error("Position and LookAt are the same, no view directin possible!");
    }
    this->resolution[0] = width;
    this->resolution[1] = height;

    this->fov_y = fov * (height/width) * (M_PI / 180);
}

Camera::~Camera() {}