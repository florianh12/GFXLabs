#include "camera.h"
#include <stdexcept>
#include <cmath>

Camera::Camera(Point3D position, Point3D lookat, Vec3 up, unsigned int fov, unsigned int width, unsigned int height, unsigned int max_bounces) : position{position}, lookat{lookat}, up{up},fov_x{fov * M_PI / 180}, max_bounces{max_bounces} {
    if(position == lookat) {
        throw std::runtime_error("Position and LookAt are the same, no view direction possible!");
    }
    
    if(up.vec_norm() == 0.0L) {
        throw std::runtime_error("Up direction is nullvector!");
    }

    this->resolution[0] = width;
    this->resolution[1] = height;

    this->fov_y = fov * (height/width) * (M_PI / 180);
}

Mat3 Camera::getRotationMatrix() {
    Vec3 Z = position - lookat;
    Z.normalize();
    Vec3 X = up % Z;
    X.normalize();
    Vec3 Y = Z % X;
    Y.normalize();

    return Mat3(X,Y,Z);
}

Camera::~Camera() {}